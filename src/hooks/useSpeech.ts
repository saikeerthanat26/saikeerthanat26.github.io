import {useEffect,useRef,useState} from 'react';
export function useSpeech(){const supported='speechSynthesis' in window;const [voices,setVoices]=useState<SpeechSynthesisVoice[]>([]),[selected,setSelected]=useState(''),[status,setStatus]=useState('Device voice — not Sai’s recorded voice.');const audio=useRef<HTMLAudioElement|null>(null);
 const stop=()=>{if(supported)speechSynthesis.cancel();audio.current?.pause();audio.current=null;};
 useEffect(()=>{if(!supported){setStatus('This browser does not support read-aloud. Text chat is available.');return;}const refresh=()=>setVoices(speechSynthesis.getVoices());refresh();speechSynthesis.addEventListener('voiceschanged',refresh);return()=>{speechSynthesis.removeEventListener('voiceschanged',refresh);speechSynthesis.cancel();audio.current?.pause();};},[supported]);
 const speak=(text:string,recording?:string)=>{stop();if(recording){audio.current=new Audio(recording);audio.current.play().catch(()=>setStatus('Recording could not be played.'));return;}if(!supported)return;const utterance=new SpeechSynthesisUtterance(text);utterance.voice=voices.find(v=>v.voiceURI===selected)||null;utterance.rate=.98;utterance.onerror=()=>setStatus('Read-aloud unavailable. The text response remains available.');speechSynthesis.speak(utterance);};
 return {supported,voices,selected,setSelected,status,speak,stop};
}
