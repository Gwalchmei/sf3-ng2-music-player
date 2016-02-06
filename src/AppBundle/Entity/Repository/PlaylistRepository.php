<?php
/**
 * Created by PhpStorm.
 * User: gauvain
 * Date: 06/02/16
 * Time: 17:06
 */

namespace AppBundle\Entity\Repository;

use Doctrine\ORM\EntityRepository;

class PlaylistRepository extends EntityRepository
{
    public function myFindAll()
    {
        $qb = $this->_em->createQueryBuilder();
        $qb
            ->select('p, m')
            ->from($this->_entityName, 'p')
            ->leftJoin('p.musics', 'm')
        ;

        return $qb->getQuery()->getResult();
    }
}
