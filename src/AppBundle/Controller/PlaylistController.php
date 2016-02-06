<?php
/**
 * Created by PhpStorm.
 * User: gauvain
 * Date: 06/02/16
 * Time: 15:24
 */

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

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
        $playlists = $this->getDoctrine()->getManager()->getRepository('AppBundle:Playlist')->myFindAll();
        $output = array();
        foreach ($playlists as $playlist) {
            $output[$playlist->getId()] = array(
                'id' => $playlist->getId(),
                'name' => $playlist->getName(),
                'musics' => $playlist->getMusics()->map(function($m){return $m->getId();})->toArray()
            );
        }
        $response = new JsonResponse();
        $response->setData(array('data' => $output));

        return $response;
    }
}
