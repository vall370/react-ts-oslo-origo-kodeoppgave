import React from 'react';
import ReactDOM from 'react-dom';
import StationsList from './StationsList';

const App: React.FunctionComponent = () => {

    return (
        <div style={{ height: '100vh' }}>
            <StationsList />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));