import React, { useState } from 'react';
import './App.css';

// components
import AutoComplete from './components/AutoComplete';
import ChosensList from './components/ChosensList';

function App() {
  const [chosens, setChosens] = useState<string[]>([]);
  const multiple: boolean = true;

  return (
    <div className='app'>
      <div className='auto-complete'>
        <AutoComplete
          chosens={chosens}
          setChosens={setChosens}
          multiple={multiple}
        />
      </div>
      {chosens.length !== 0 && (
        <ChosensList chosens={chosens} multiple={multiple} />
      )}
    </div>
  );
}

export default App;
