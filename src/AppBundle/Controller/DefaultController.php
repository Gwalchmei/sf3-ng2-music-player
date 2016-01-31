<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', [
            'base_dir' => realpath($this->container->getParameter('kernel.root_dir').'/..'),
        ]);
    }

    /**
     * @Route("/stream/{filename}", name="stream_music")
     * @param string $filename
     * @return StreamedResponse
     */
    public function streamAction($filename)
    {
        $this->denyAccessUnlessGranted('ROLE_USER', null, 'Unable to access this page!');
        $file = 'music/'.$filename;
        return new StreamedResponse(
            function () use ($file) {
                readfile($file);
            }, 200, array('Content-Type' => 'audio/mpeg')
        );
    }

    /**
     * @Route("/list/", name="list_music")
     */
    public function listAction()
    {
        $this->denyAccessUnlessGranted('ROLE_USER', null, 'Unable to access this page!');
        $list = shell_exec('ls music/');
        $array = explode("\n", trim($list));
        $output = array();
        foreach ($array as $key => $filename) {
            $output[] = array('id' => $key, 'filename' => $filename);
        }
        $response = new JsonResponse();
        $response->setData(array('data' => $output));

        return $response;
    }
}
