import { useState } from 'react'
import Grid from './components/grid/Grid'

const App: React.FC = () => {
  const [restart, setRestart] = useState<boolean>(false)
  
  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Grid reset={restart}></Grid>
    </div>
  );
}

export default App;
