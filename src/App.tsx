import { useState } from 'react'
import Grid from './components/grid/Grid'

const App: React.FC = () => {
  


  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#bbb'}}>
      <Grid></Grid>
    </div>
  );
}

export default App;
