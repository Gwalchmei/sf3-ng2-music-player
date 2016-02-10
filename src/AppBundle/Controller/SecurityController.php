<?php
/**
 * Created by PhpStorm.
 * User: gauvain
 * Date: 30/01/16
 * Time: 22:24
 */

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class SecurityController extends Controller
{
    /**
     * @Route("/login", name="login_route")
     * @param Request $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function loginAction(Request $request)
    {
        $authenticationUtils = $this->get('security.authentication_utils');

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();

        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        $output = array(
            // last username entered by the user
            'last_username' => $lastUsername,
            'error'         => $error
        );

        $response = new JsonResponse();
        $response->setData(array('data' => $output));

        return $response;
    }

    /**
     * @Route("/login_check", name="login_check")
     */
    public function loginCheckAction()
    {
        // this controller will not be executed,
        // as the route is handled by the Security system
    }

    /**
     * @Route("/login_success", name="login_success")
     */
    public function loginSuccessAction()
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_REMEMBERED', null, 'Unable to access this page!');
        $user = $this->getUser();
        $response = new JsonResponse();
        $response->setData(
            array(
                'data' => array(
                    'login_state' => 'success',
                    'username' => $user->getUsername()
                )
            )
        );

        return $response;
    }

    /**
     * @Route("/logout_success", name="logout_success")
     * @return JsonResponse
     */
    public function logoutSuccessAction()
    {
        return new JsonResponse();
    }
}
