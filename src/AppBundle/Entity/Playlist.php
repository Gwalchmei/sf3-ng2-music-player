<?php
/**
 * Created by PhpStorm.
 * User: gauvain
 * Date: 06/02/16
 * Time: 15:21
 */

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="AppBundle\Entity\Repository\PlaylistRepository")
 * Class Playlist
 * @package AppBundle\Entity
 */
class Playlist
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
     * @ORM\ManyToMany(targetEntity="AppBundle\Entity\Music", mappedBy="playlists", cascade={"all"})
     */
    protected $musics;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->musics = new ArrayCollection();
    }

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
     * Add music
     *
     * @param Music $music
     *
     * @return Playlist
     */
    public function addMusic(Music $music)
    {
        if (!$this->musics->contains($music)) {
            $this->musics->add($music);
        }

        return $this;
    }

    /**
     * Remove music
     *
     * @param \AppBundle\Entity\Music $music
     */
    public function removeMusic(Music $music)
    {
        $this->musics->removeElement($music);
    }

    /**
     * Get musics
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getMusics()
    {
        return $this->musics;
    }
}
