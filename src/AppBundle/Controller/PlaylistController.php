<?php
/**
 * Created by PhpStorm.
 * User: gauvain
 * Date: 06/02/16
 * Time: 15:24
 */

namespace AppBundle\Controller;

use AppBundle\Entity\Playlist;
use AppBundle\Form\PlaylistType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @Route("/playlist")
 * Class PlaylistController
 * @package AppBundle\Controller
 */
class PlaylistController extends Controller
{
    /**
     * @Route("/", name="get_playlist")
     * @Method("GET")
     * @return JsonResponse
     * @throws \Exception
     */
    public function getAction()
    {
        $this->denyAccessUnlessGranted('ROLE_USER', null, 'Unable to access this page!');
        $playlists = $this->getDoctrine()->getManager()->getRepository('AppBundle:Playlist')->findAll();
        $output = array();
        foreach ($playlists as $playlist) {
            $output[] = array(
                'id' => $playlist->getId(),
                'name' => $playlist->getName()
            );
        }
        $response = new JsonResponse();
        $response->setData(array('data' => $output));

        return $response;
    }

    /**
     * @Route("/", name="create_playlist")
     * @Method("POST")
     * @param Request $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function createAction(Request $request)
    {
        $playlist = new Playlist();
        $form = $this->createForm(
            PlaylistType::class,
            $playlist
        );
        $form->handleRequest($request);
        $response = new JsonResponse();
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($playlist);
            $em->flush();

            $response->setData(
                array(
                    'id' => $playlist->getId(),
                    'name' => $playlist->getName()
                )
            );

            return $response;
        }


        $response->isServerError();

        return $response;
    }

    /**
     * @Route("/{id}", name="delete_playlist", requirements={"id"="\d+"})
     * @Method("DELETE")
     * @param $id
     * @return JsonResponse
     * @throws \Exception
     */
    public function deleteAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $playlist = $em->getRepository('AppBundle:Playlist')->find($id);
        if (!$playlist instanceof Playlist) {
            throw $this->createNotFoundException('Playlist not found');
        }
        $em->remove($playlist);
        $em->flush();

        $response = new JsonResponse();
        $response->setData(array('success'));

        return $response;
    }
}
