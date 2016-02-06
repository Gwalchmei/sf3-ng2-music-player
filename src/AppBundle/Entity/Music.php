<?php
/**
 * Created by PhpStorm.
 * User: gauvain
 * Date: 06/02/16
 * Time: 12:45
 */

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Class Music
 * @ORM\Table()
 * @ORM\Entity()
 * @package AppBundle\Entity
 */
class Music
{
    /**
     * @var integer
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string
     * @ORM\Column(type="string", length=255)
     */
    protected $name;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, unique=true)
     * @Assert\File(mimeTypes={"audio/mpeg"})
     */
    protected $path;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param $name
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param $path
     * @return $this
     */
    public function setPath($path)
    {
        $this->path= $path;

        return $this;
    }

    /**
     * @return string
     */
    public function getPath()
    {
        return $this->path;
    }
}
