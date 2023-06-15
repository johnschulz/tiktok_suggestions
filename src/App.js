
import './App.css';
// import React from "react";


import React, { useState, useEffect, useRef} from 'react';

import Papa from 'papaparse';


function App() {
  // const videoIds = ['7233875954752392490', '7230276347430440234', '7203098293654768942'];
  const [videoIds, setVideoIds] = useState([]);
  const [autoplay, setAutoplay] = useState(true);
  const iframeRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [selectedCSV, setSelectedCSV] = useState('/3lauren-daigle-6-14-23.csv');

  const handleUnmute = () => {
    setMuted(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      // if (selectedCSV) {
      const response = await fetch(`${selectedCSV}`);
      //   // ...
      // }
      // const response = await fetch('/2lauren-daigle-6-14-23.csv');
      console.log(response)
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value);
      const { data } = Papa.parse(csv, { header: true });
      console.log(data)
      const parsedVideoIds = data.map((row) => row.video_tiktok_id);
      // console
      setVideoIds(parsedVideoIds);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // if (selectedCSV) {
      const response = await fetch(`${selectedCSV}`);
      //   // ...
      // }
      // const response = await fetch('/2lauren-daigle-6-14-23.csv');
      console.log(response)
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value);
      const { data } = Papa.parse(csv, { header: true });
      console.log(data)
      const parsedVideoIds = data.map((row) => row.video_tiktok_id);
      // console
      setVideoIds(parsedVideoIds);
    };

    fetchData();
  }, [selectedCSV]);
  // const videoIds = ['1234567890', '0987654321', '1357902468'];
  // const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const goToNextVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      (prevIndex + 1) % videoIds.length
    );
  };

  const goToVideoIndex = (index) => {
    setCurrentVideoIndex(index);
  };

  const handleVideoIndexChange = (event) => {
    const index = parseInt(event.target.value);
    setCurrentVideoIndex(index);
  };

  const goToPreviousVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      (prevIndex - 1 + videoIds.length) % videoIds.length
    );
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        goToPreviousVideo();
      } else if (event.key === 'ArrowRight') {
        goToNextVideo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentVideoId = videoIds[currentVideoIndex];

  useEffect(() => {
    if (autoplay) {
      playVideo();
    }
  }, [autoplay,currentVideoId]);

  useEffect(() => {
    // Reset current video index when the video IDs change
    setCurrentVideoIndex(0);
  }, [videoIds]);

  const playVideo = () => {
    if (iframeRef.current) {
      console.log('adasdads')
      iframeRef.current.contentWindow.postMessage(
        { event: 'command', func: 'playVideo' },
        '*'
      );
        setTimeout(() => {
        // iframeRef.current.unmute();
        iframeRef.current.muted = false;
        fetch('https://mcs.us.tiktok.com/v1/list', {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Content-Type': 'application/json; charset=UTF-8',
        Origin: 'https://www.tiktok.com',
        Referer: 'https://www.tiktok.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
      },
      body: JSON.stringify([
        {
          events: [
            {
              event: 'tap',
              params: `{"page_name":"embed_video_v2","enter_from":"embed_video_v2","video_id":"${currentVideoId}","url":"/embed/v2/${currentVideoId}","target":"embed_switch_sound","event_index":${Date.now()}}`,
              local_time_ms: Date.now(),
              is_bav: 0,
              session_id: '95109835-990d-4760-a781-82081d4a069f',
            },
          ],
          user: {
            user_unique_id: '7160541670533875246',
            web_id: '7190041131035297322',
          },
          header: {
            app_id: 1284,
            os_name: 'mac',
            os_version: '10_15_7',
            device_model: 'Macintosh',
            language: 'en-US',
            platform: 'web',
            sdk_version: '5.0.35_oversea',
            sdk_lib: 'js',
            timezone: -4,
            tz_offset: 14400,
            resolution: '1792x1120',
            browser: 'Chrome',
            browser_version: '113.0.0.0',
            referrer: 'https://www.tiktok.com',
            referrer_host: 'https://www.tiktok.com/',
            width: 1792,
            height: 1120,
            screen_width: 1792,
            screen_height: 1120,
            tracer_data: '{"$utm_from_url":1}',
            custom: '{"traffic_type":"others","launch_mode":"referral","device":"pc","region":"US","psm":"tiktok.web.embed","idc":"ttp","embed_from":"embed","embed_source":"71223856,121331973,120811592,120810756;null;null"}',
          },
          local_time: Math.floor(Date.now() / 1000),
          verbose: 1,
        },
      ]),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Unmute response:', data);
      })
      .catch((error) => {
        console.error('Error unmuting video:', error);
      });
        console.log('aaaa')
      }, 5000); 
    }
  };
  const handleVideoInteraction = () => {
    if (autoplay) {
      playVideo();
    }
  };
  console.log(muted)
  return (
    <div>
      <h1>TikTok Video List</h1>
      <button onClick={() => setSelectedCSV('3lauren-daigle-6-14-23.csv')}>
        Max Filtering
      </button>
      <button onClick={() => setSelectedCSV('lauren-daigle-6-14-23.csv')}>
        Some Filtering
      </button>
      <button onClick={() => setSelectedCSV('2lauren-daigle-6-14-23.csv')}>
        Minimal Filtering
      </button>

      <div>
        <button onClick={goToPreviousVideo}>{'<'}</button>
        <iframe
          id="tiktok-embed"
          title="TikTok Video"
          src={`https://www.tiktok.com/embed/v2/${currentVideoId}`}
          width="100%"
          height="800px"
          frameBorder="0"
          allowFullScreen
          allow="autoplay"
          muted={false}
          // volume={1}
          onClick={handleVideoInteraction}
          ref={iframeRef}
        ></iframe>
        
        <button onClick={goToNextVideo}>{'>'}</button>
        {!muted && (
          <button onClick={handleUnmute}>Unmute</button>
        )}
        <div>
          <input
            type="number"
            min={0}
            max={videoIds.length - 1}
            value={currentVideoIndex}
            onChange={handleVideoIndexChange}
          />
          <span>/ {videoIds.length - 1}</span>
        </div>
      </div>
    </div>
  );
};

export default App;

