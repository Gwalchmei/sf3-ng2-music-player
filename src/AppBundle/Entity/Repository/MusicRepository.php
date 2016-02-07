<?php
/**
 * Created by PhpStorm.
 * User: gauvain
 * Date: 06/02/16
 * Time: 17:46
 */

namespace AppBundle\Entity\Repository;

use Doctrine\ORM\EntityRepository;

class MusicRepository extends EntityRepository
{
    public function myFindAll($pid = null, $offset = 0)
    {
        $qb = $this->_em->createQueryBuilder();
        $qb
            ->select('m')
            ->from($this->_entityName, 'm')
            ->leftJoin('m.playlists', 'p')
            ->setFirstResult($offset*20)->setMaxResults(20)
        ;
        if (isset($pid)) {
            $qb->andWhere($qb->expr()->eq('p.id', ':pid'))->setParameter('pid', $pid);
        }

        return $qb->getQuery()->getResult();
    }
}
