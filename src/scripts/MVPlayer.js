export default class MVPlayer
{
    constructor()
    {
        this.options                      = {};
        this.options.SEL_MAIN             = '.mvplayer';
        this.options.SEL_MAIN_VIDEO       = '.mvplayer__video';
        this.options.SEL_CTRLS_MAIN       = '.mvplayer__controls';
        this.options.SEL_CTRLS_COL        = '.mvplayer__col';
        this.options.SEL_BTN_PREV         = '.mvplayer__prev';
        this.options.SEL_BTN_PLAYPAUSE    = '.mvplayer__playpause';
        this.options.SEL_BTN_NEXT         = '.mvplayer__next';
        this.options.SEL_BTN_SOUND        = '.mvplayer__snd';
        this.options.SEL_BTN_VOLUME       = '.mvplayer__volume';
        this.options.SEL_BTN_VOLUME_CURR  = '.mvplayer__volume-current';
        this.options.SEL_BTN_VOLUME_THUMB = '.mvplayer__volume-thumb';
        this.options.SEL_BTN_SETTINGS     = '.mvplayer__settings';
        this.options.SEL_BTN_FSCREEN      = '.mvplayer__fs';
        this.options.SEL_OVERLAY          = '.mvplayer__overlay';
        this.options.SEL_TIMER            = '.mvplayer__progress';
        this.options.SEL_TIMELINE         = '.mvplayer__timeline';
        this.options.SEL_TIMELINE_POS     = '.mvplayer__position';
        this.options.SEL_TIMELINE_LOADED  = '.mvplayer__loaded';

        this.options.STATE =
        {
            NULL:       null,
            PLAYING:    'mvplayer--playing',
            PAUSED:     'mvplayer--paused',
            MUTED:      'mvplayer--muted',
            FULLSCREEN: 'mvplayer--fullscreen'
        }

    } // constructor

    Init( options = null )
    {
        let _options = Object.assign( this.options, this.options || options );

        let _players = Array.from( document.querySelectorAll( _options.SEL_MAIN ) );

        _players.forEach((_el)=>{

            _el.loop                          = Object.create(null);
            _el.loop.state                    = this.options.STATE.NULL;
            _el.loop.options                  = _options;
            _el.loop.main_cont                = _el;
            _el.loop.video                    = _el.loop.main_cont.querySelector( _options.SEL_MAIN_VIDEO );
            _el.loop.controls_main            = _el.loop.main_cont.querySelector( _options.SEL_CTRLS_MAIN );
            _el.loop.controls_cols            = Array.from( _el.loop.main_cont.querySelectorAll( _options.SEL_CTRLS_COL ) );
            _el.loop.controls_btn_prev        = _el.loop.main_cont.querySelector( _options.SEL_BTN_PREV );
            _el.loop.controls_btn_play        = _el.loop.main_cont.querySelector( _options.SEL_BTN_PLAYPAUSE );
            _el.loop.controls_btn_next        = _el.loop.main_cont.querySelector( _options.SEL_BTN_NEXT );
            _el.loop.controls_btn_sound       = _el.loop.main_cont.querySelector( _options.SEL_BTN_SOUND );
            _el.loop.controls_btn_settings    = _el.loop.main_cont.querySelector( _options.SEL_BTN_SETTINGS );
            _el.loop.controls_btn_fs          = _el.loop.main_cont.querySelector( _options.SEL_BTN_FSCREEN );
            _el.loop.controls_volume          = _el.loop.main_cont.querySelector( _options.SEL_BTN_VOLUME );
            _el.loop.controls_volume_current  = _el.loop.main_cont.querySelector( _options.SEL_BTN_VOLUME_CURR );
            _el.loop.controls_volume_thumb    = _el.loop.main_cont.querySelector( _options.SEL_BTN_VOLUME_THUMB );
            _el.loop.controls_overlay         = _el.loop.main_cont.querySelector( _options.SEL_OVERLAY );
            _el.loop.controls_timer           = _el.loop.main_cont.querySelector( _options.SEL_TIMER );
            _el.loop.controls_timeline        = _el.loop.main_cont.querySelector( _options.SEL_TIMELINE );
            _el.loop.controls_timeline_pos    = _el.loop.main_cont.querySelector( _options.SEL_TIMELINE_POS );
            _el.loop.controls_timeline_loaded = _el.loop.main_cont.querySelector( _options.SEL_TIMELINE_LOADED );

            _el.loop.controls_btn_play.OnBtnPlayDel = this._OnBtnPlay.call( this, _el.loop );
            _el.loop.controls_btn_play.addEventListener( 'click', _el.loop.controls_btn_play.OnBtnPlayDel );
            //_el.loop.controls_btn_play.removeEventListener( 'click', _el.loop.controls_btn_play.OnBtnPlayDel );
            _el.loop.controls_overlay.addEventListener( 'click', _el.loop.controls_btn_play.OnBtnPlayDel );

            _el.loop.controls_btn_sound.OnBtnSoundDel = this._OnBtnSound.call( this, _el.loop );
            _el.loop.controls_btn_sound.addEventListener( 'click', _el.loop.controls_btn_sound.OnBtnSoundDel );

            _el.loop.controls_btn_fs.OnBtnFSDel = this._OnBtnFS.call( this, _el.loop );
            _el.loop.controls_btn_fs.addEventListener( 'click', _el.loop.controls_btn_fs.OnBtnFSDel );

            _el.loop.controls_volume.OnVolumeDel = this._OnVolume.call( this, _el.loop );
            _el.loop.controls_volume.addEventListener( 'click', _el.loop.controls_volume.OnVolumeDel );

            //_OnTimeUpdate
            _el.loop.video.OnTimeUpdateDel = this._OnTimeUpdate.call( this, _el.loop );
            _el.loop.video.addEventListener( 'timeupdate', _el.loop.video.OnTimeUpdateDel );

            _el.loop.controls_timeline.OnTimelineDel = this._OnTimeline.call( this, _el.loop );
            _el.loop.controls_timeline.addEventListener( 'click', _el.loop.controls_timeline.OnTimelineDel );

            _el.loop.video.OnLoadedDataDel = this._OnLoadedData.call( this, _el.loop );
            _el.loop.video.addEventListener( 'timeupdate', _el.loop.video.OnLoadedDataDel );

            //TODO:
            _el.loop.controls_overlay.OnOverlayAniEndDel = this._OnOverlayAniEnd.call( this, _el.loop );
            _el.loop.controls_overlay.addEventListener( 'animationend', _el.loop.controls_overlay.OnOverlayAniEndDel );

            this._GeneTimeData( _el.loop );

            this.UpdateVolumeUI( _el.loop );

        });

    } // Init

    _OnVolume( loop )
    {
        return (e)=>
        {
            let _left   = e.clientX - e.currentTarget.getBoundingClientRect().left;
            let _volume = _left / e.currentTarget.offsetWidth;

            //TODO: temp code
            _volume = _volume < 0.05 ? 0 : _volume;
            _volume = _volume > 0.9  ? 1 : _volume;

            loop.video.volume = _volume;

            this.UpdateVolumeUI( loop );
        }

    } // _OnVolume

    UpdateVolumeUI( loop )
    {
        loop.controls_volume_current.style['width']   = `${loop.video.volume*100}%`;
        loop.controls_volume_thumb.style['transform'] = `translate3d(${loop.controls_volume.offsetWidth*loop.video.volume}px, 0, 0)`;

        if( loop.video.muted )
        {
            loop.controls_volume_current.style['width']   = 0;
            loop.controls_volume_thumb.style['transform'] = `translate3d(0, 0, 0)`;
        }

        loop.main_cont.classList.toggle( loop.options.STATE.MUTED, loop.video.volume < 0.05 || loop.video.muted );

    } // UpdateVolumeUI

    _OnOverlayAniEnd( loop )
    {
        return (e)=>
        {
            if( e.animationName === "mvplayer__fadein" )
            {
                e.currentTarget.style['animation-name'] = 'none';
            }
        }

    } // _OnOverlayAniEnd

    _OnLoadedData( loop )
    {
        return (e)=>
        {
            //TODO: add fragments
            let _tranges  = loop.video.buffered.length - 1;
            let _percent = loop.video.buffered.end( _tranges ) / loop.video.duration;

            loop.controls_timeline_loaded.style['width'] = _percent * 100 + '%';

            loop.controls_timeline_pos.style['width'] = ( loop.video.currentTime / loop.video.duration * 100 ) + '%';
        }

    } // _OnLoadedData

    _OnTimeline( loop )
    {
        return (e)=>
        {
            let _offset         = e.currentTarget.getBoundingClientRect();
            let _options        = loop.options;
            let _states         = loop.options.STATE;
            let _main_classList = loop.main_cont.classList;
            let _el             = e.currentTarget;
            let _x              = e.clientX - _offset.x;
            let _percent        = e.clientX / e.currentTarget.offsetWidth;

            loop.controls_timeline_pos.style['width'] = _percent * 100 + '%';
            loop.video.currentTime                    = loop.video.duration * _percent;
        }

    } // _OnTimeline

    _OnTimeUpdate( loop )
    {
        return (e)=>
        {
            this._GeneTimeData( loop );
        }

    } // _OnTimeUpdate

    _GeneTimeData( loop )
    {
        let _options        = loop.options;
        let _states         = loop.options.STATE;
        let _main_classList = loop.main_cont.classList;

        let _current_h = Math.round( loop.video.currentTime/3600 );
            _current_h = _current_h < 10 ? `0${_current_h}` : _current_h;
            _current_h = _current_h == 0 ? '' : `${_current_h}:`;
        let _current_m = Math.round( loop.video.currentTime/60 );
            _current_m = _current_m < 10 ? `0${_current_m}` : _current_m;
        let _current_s = Math.round( loop.video.currentTime ) % 60;
            _current_s = _current_s < 10 ? `0${_current_s}` : _current_s;

        let _current = `${_current_h}${_current_m}:${_current_s}`;

        let _duration_s = Math.round( loop.video.duration ) % 60;
            _duration_s = _duration_s < 10 ? `0${_duration_s}` : _duration_s;
            _duration_s = isNaN( _duration_s ) ? '00' : _duration_s;
        let _duration_m = Math.round( loop.video.duration/60 );
            _duration_m = _duration_m < 10 ? `0${_duration_m}` : _duration_m;
            _duration_m = isNaN( _duration_m ) ? '00' : _duration_m;
        let _duration_h = Math.round( loop.video.duration/3600 );
            _duration_h = isNaN( _duration_h ) ? 0 : _duration_h;
            _duration_h = _duration_h < 10 ? `0${_duration_h}` : _duration_h;
            _duration_h = _duration_h == 0 ? '' : `${_duration_h}:`;

        let _duration = `${_duration_h}${_duration_m}:${_duration_s}`;

        loop.controls_timer.innerHTML = `${_current} / ${_duration}`;

    } // _GeneTimeData

    _OnBtnPlay( loop )
    {
        return (e)=>
        {
            let _options        = loop.options;
            let _states         = loop.options.STATE;
            let _main_classList = loop.main_cont.classList;

            loop.controls_overlay.style['animation-name'] = 'mvplayer__fadein';

            if( _main_classList.contains( loop.options.STATE.PLAYING ) )
            {
                _main_classList.remove( loop.options.STATE.PLAYING );
                _main_classList.add( loop.options.STATE.PAUSED );

                loop.video.pause();
            }
            else
            {
                _main_classList.remove( loop.options.STATE.PAUSED );
                _main_classList.add( loop.options.STATE.PLAYING );

                loop.video.play();
            }
        }

    } // _OnBtnPlay

    _OnBtnSound( loop )
    {
        return (e)=>
        {
            let _options        = loop.options;
            let _states         = loop.options.STATE;
            let _main_classList = loop.main_cont.classList;

            if( _main_classList.contains( loop.options.STATE.MUTED ) )
            {
                _main_classList.remove( loop.options.STATE.MUTED );

                loop.video.muted = false;

            }
            else
            {
                _main_classList.add( loop.options.STATE.MUTED );

                loop.video.muted = true;
            }

            this.UpdateVolumeUI( loop );
        }

    } // _OnBtnSound

    _OnBtnFS( loop )
    {
        return (e)=>
        {
            let _options        = loop.options;
            let _states         = loop.options.STATE;
            let _main_classList = loop.main_cont.classList;

            if( _main_classList.contains( loop.options.STATE.FULLSCREEN ) )
            {
                _main_classList.remove( loop.options.STATE.FULLSCREEN );

                let _fullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
                _fullscreen.call( document );
            }
            else
            {
                _main_classList.add( loop.options.STATE.FULLSCREEN );

                var _fullscreen = loop.main_cont.requestFullscreen || loop.main_cont.webkitRequestFullscreen || loop.main_cont.mozRequestFullScreen || loop.main_cont.msRequestFullscreen;
                _fullscreen.call( loop.main_cont );
            }
        }

    } // _OnBtnFS

    OnResize()
    {
        this.UpdateLayout();

    } // OnResize

    UpdateLayout()
    {
        //

    } // UpdateLayout

} // class MVPlayer
