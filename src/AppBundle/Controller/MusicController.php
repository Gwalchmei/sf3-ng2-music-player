<?php
/**
 * Created by PhpStorm.
 * User: gauvain
 * Date: 06/02/16
 * Time: 14:08
 */

namespace AppBundle\Controller;

use AppBundle\Entity\Music;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * @Route("/music")
 * Class MusicController
 * @package AppBundle\Controller
 */
class MusicController extends Controller
{
    /**
     * @Route("/stream/{id}", name="stream_music", requirements={"id" = "[0-9]+"})
     * @param integer $id
     * @return StreamedResponse
     */
    public function streamAction($id)
    {
        $this->denyAccessUnlessGranted('ROLE_USER', null, 'Unable to access this page!');
        $music = $this->getDoctrine()->getManager()->getRepository("AppBundle:Music")->find($id);
        if (!$music instanceof Music) {
            throw $this->createNotFoundException('No music found for id '.$id);
        }
        $file = 'music/'.$music->getPath();

        return new StreamedResponse(
            function () use ($file) {
                readfile($file);
            }, 200, array('Content-Type' => 'audio/mpeg')
        );
    }

    /**
     * @Route("/", name="get_music")
     * @Method("GET")
     * @return JsonResponse
     */
    public function getAction(Request $request)
    {
        $this->denyAccessUnlessGranted('ROLE_USER', null, 'Unable to access this page!');
        $musics = $this->getDoctrine()->getManager()->getRepository("AppBundle:Music")->myFindAll(
            $request->get('pid'),
            $request->get('page')
        );
        $output = array();
        foreach ($musics as $music) {
            $output[] = array(
                'id' => $music->getId(),
                'name' => $music->getName()
            );
        }

        $response = new JsonResponse();
        $response->setData(array('data' => $output));

        return $response;
    }

    /**
     * Update db with music folder
     * Assume music table is empty (or at least there will be no conflict on unique path)
     * @Route("/admin-import/", name="music_admin_import")
     * @Method("GET")
     */
    public function adminImportAction()
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN', null, 'Unable to access this page!');
        $em = $this->getDoctrine()->getManager();
        $list = shell_exec('ls music/');
        $array = explode("\n", trim($list));
        $length = count($array);
        for ($i = 0; $i<$length; $i++) {
            $path = $array[$i];
            $music = new Music();
            $music->setName($path)->setPath($path);
            $em->persist($music);
            if (($i % 20) === 0) {
                $em->flush();
                $em->clear();
            }
        }
        $em->flush();
        $em->clear();
        $response = new JsonResponse();
        $response->setData(array('i' => $i, 'length' => $length));

        return $response;
    }
}
