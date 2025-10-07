import { useEffect } from 'preact/hooks';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import fingerPoint from '/assets/finger-point.jpg';

export function StarterHint() {
  
  const [showStartHint, setShowStartHint] = useLocalStorage('showStartHint', 0);

  useEffect(() => {
    if (!showStartHint) {
      // show the hint for 20 seconds, then set a flag
      const timer = setTimeout(() => setShowStartHint(1), 20000); 
      return () => clearTimeout(timer);
    }
  }, [showStartHint]);

  return (
    <div id="starterhint" className={`mt-5 text-center${showStartHint ? ' d-none' : ''}`}>
      <p>
        <img src={fingerPoint} className="finger-animate" height="75" title="Look!" alt="finger pointing image" />
      </p>
      <p className="text-secondary opacity-75">Click a Category button above to get started</p>
    </div>
  );
}