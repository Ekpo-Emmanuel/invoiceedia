import React from 'react'
import HeroVideoDialog from '@/components/ui/hero-video-dialog'

export default function VideoEmbed() {
    const videoSrc = "https://www.youtube.com/embed/eJaj6d5LNhE?si=jtlNtLUf2-WfRtfJ"
  return (
    <div>
      <div className="relative">
        <HeroVideoDialog
            className="dark:hidden block"
            animationStyle="from-center"
            videoSrc={videoSrc}
            thumbnailSrc="/assets/images/preview2.png"
            thumbnailAlt="Hero Video"
        />
        </div>
    </div>
  )
}
