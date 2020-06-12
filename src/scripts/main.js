
'use strict';

import "core-js";
//import "regenerator-runtime/runtime";
import MVPlayer from './MVPlayer';

function Main(e)
{
    window.mvplayer = new MVPlayer();

} // Main


function OnLoaded(e)
{
    window.mvplayer.Init();

} // OnLoaded


function OnResize(e)
{
    window.mvplayer.OnResize();

} // OnResize


window.addEventListener( "DOMContentLoaded", Main );
window.addEventListener( "load",             OnLoaded );
window.addEventListener( "resize",           ()=>{ OnResize(); } );
