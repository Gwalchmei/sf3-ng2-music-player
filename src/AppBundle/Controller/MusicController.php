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
     * @Route("/{id}", name="get_music", requirements={"id" = "[0-9]+"})
     * @Method("GET")
     * @param $id
     * @return JsonResponse
     */
    public function getAction($id)
    {
        $this->denyAccessUnlessGranted('ROLE_USER', null, 'Unable to access this page!');
        $music = $this->getDoctrine()->getManager()->getRepository("AppBundle:Music")->find($id);
        if (!$music instanceof Music) {
            throw $this->createNotFoundException('No music found for id '.$id);
        }

        $response = new JsonResponse();
        $response->setData(
            array(
                'data' => array("id" => $music->getId(), "name" => $music->getName())
            )
        );

        return $response;
    }
}
