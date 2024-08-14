import React, { useState, useEffect, useRef } from 'react';
import './PointGame.css';

const PointGame = () => {
    const [point, setPoint] = useState(0);
    const [pointsArray, setPointsArray] = useState([]);
    const [clickOrder, setClickOrder] = useState([]);
    const [gameStatus, setGameStatus] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [time, setTime] = useState(0);
    const timerRef = useRef(null);

    const handlePointChange = (e) => {
        setPoint(parseInt(e.target.value));
        setGameStatus(null);
    };

    const startGame = () => {
        const shuffledArray = Array.from({ length: point }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
        setPointsArray(shuffledArray.map(num => ({
            num,
            x: Math.random() * 90,
            y: Math.random() * 90,
        })));
        setClickOrder([]);
        setGameStatus(null);
        setGameStarted(true);
        setTime(0);

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        timerRef.current = setInterval(() => {
            setTime(prevTime => prevTime + 0.1);
        }, 100);
    };

    const stopGame = () => {
        clearInterval(timerRef.current);
        setGameStarted(false);
    };

    const handleClick = (number) => {
        const newClickOrder = [...clickOrder, number];

        if (number !== clickOrder.length + 1) {
            setGameStatus('GAME OVER');
            stopGame();
        } else {
            setClickOrder(newClickOrder);

            if (newClickOrder.length === point) {
                setTimeout(() => {
                    setGameStatus('ALL CLEARED');
                    stopGame();
                }, 1000);
            } else {
                setTimeout(() => {
                    setPointsArray(prevArray => prevArray.filter(p => p.num !== number));
                }, 1000);
            }
        }
    };

    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    return (
        <div>
                <h1 className={`status-message ${gameStatus === 'ALL CLEARED' ? 'clear' : gameStatus === 'GAME OVER' ? 'game-over' : ''}`}>
                    {gameStatus ? gameStatus : "LET'S PLAY"}
                </h1>
            <table>
                <tbody>
                <tr>
                    <td>
                        <label>Points: </label>
                    </td>
                    <td>
                        <input
                            type="number"
                            value={point}
                            onChange={handlePointChange}
                            min="1"
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        Time:
                    </td>
                    <td>
                        {time.toFixed(1)}s
                    </td>
                </tr>
                <tr>
                    <td>
                        <button onClick={startGame} disabled={point < 1 || point > 1000}>
                            {gameStarted ? 'Restart' : 'Play'}
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
            <div className="game-container">
                {pointsArray.map(({num, x, y}) => (
                    <button
                        key={num}
                        onClick={() => handleClick(num)}
                        className="circle-button"
                        style={{
                            backgroundColor: clickOrder.includes(num) ? 'red' : 'white',
                            transition: 'background-color 0.5s ease',
                            left: `${x}%`,
                            top: `${y}%`
                        }}
                        disabled={gameStatus !== null && gameStatus !== 'Clear'}
                    >
                        {num}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PointGame;
