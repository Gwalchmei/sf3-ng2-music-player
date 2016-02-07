<?php
/**
 * Created by PhpStorm.
 * User: gauvain
 * Date: 06/02/16
 * Time: 12:45
 */

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Class Music
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="AppBundle\Entity\Repository\MusicRepository")
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
     */
    protected $path;

    /**
     * @var float
     * @ORM\Column(type="decimal", precision=10, scale=2, nullable=true)
     */
    protected $duration;

    /**
     * @ORM\ManyToMany(targetEntity="AppBundle\Entity\Playlist", inversedBy="musics", cascade={"all"})
     */
    protected $playlists;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->playlists = new ArrayCollection();
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

    /**
     * @param $duration
     * @return $this
     */
    public function setDuration($duration)
    {
        $this->duration = $duration;

        return $this;
    }

    /**
     * @return float
     */
    public function getDuration()
    {
        return $this->duration;
    }

    /**
     * Add playlist
     *
     * @param Playlist $playlist
     *
     * @return Music
     */
    public function addPlaylist(Playlist $playlist)
    {
        if (!$this->playlists->contains($playlist)) {
            $this->playlists->add($playlist);
        }

        return $this;
    }

    /**
     * Remove playlist
     *
     * @param Playlist $playlist
     */
    public function removePlaylist(Playlist $playlist)
    {
        $this->playlists->removeElement($playlist);
    }

    /**
     * Get playlists
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getPlaylists()
    {
        return $this->playlists;
    }
}
