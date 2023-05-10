import { useState, useEffect } from 'react';
import check from '../../Assets/Modal-Icons/Check.png';
import wrong from '../../Assets/Modal-Icons/Wrong.png';
import silver from '../../Assets/Csgo-Icons/Silver.png';
import se from '../../Assets/Csgo-Icons/SE.png';
import nova from '../../Assets/Csgo-Icons/Nova.png';
import mg from '../../Assets/Csgo-Icons/MG.png';
import dmg from '../../Assets/Csgo-Icons/DMG.png';
import le from '../../Assets/Csgo-Icons/LE.png';
import mge from '../../Assets/Csgo-Icons/MGE.png';
import smfc from '../../Assets/Csgo-Icons/SMFC.png';
import ge from '../../Assets/Csgo-Icons/GE.png';
import VideoPlayer from '../Youtube';
import Cookies from 'js-cookie';
import RankImage from './RankImage';

const Csgo = () => {
  const [selectedRank, setSelectedRank] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [url, setUrl] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const token = Cookies.get('token');
  const [showModal, setShowModal] = useState(false);
  const [rank, setRank] = useState('');
  const [score, setScore] = useState(0);
  const [result, setResult] = useState('');
  const [point , setPoint] = useState(0);
  const [player , setPlayer] = useState('');


  const handleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (token) {
      setLoggedIn(true);
    }
  }, [token]);

  useEffect(() => {
    setIsButtonDisabled(selectedRank === null);
  }, [selectedRank]);

  const handleRankClick = (rank) => {
    setSelectedRank(rank);
  };

  const youtubeUrl = url;
  const rankImages = {
    'Silver': silver,
    'Silver Elite': se,
    'Gold Nova': nova,
    'Master Guardian': mg,
    'Distinguished Master Guardian': dmg,
    'Legendary Eagle': le,
    'Master Guardian Elite': mge,
    'Supreme': smfc,
    'Global Elite': ge
  };
  
  const pic = rankImages[rank];
  const submittedRank = rankImages[selectedRank];

  useEffect(() => {
    const getPoints = async () => {
      const response = await fetch('https://rr-back-end.onrender.com/getpoints', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          username: Cookies.get('userName'),
        },
      });
      const data = await response.json();
      setScore(data.points)
    };
    getPoints();
  }, [token]);


  const addPoints = async () => {
    const response = await fetch('https://rr-back-end.onrender.com/addpoints', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        username: Cookies.get('userName'),
      },
    });
    // eslint-disable-next-line no-unused-vars
    const data = await response.json();
    setScore(data.user.points)
  };
  
  const Add1Points = async () => {
    const response = await fetch('https://rr-back-end.onrender.com/add1points', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        username: Cookies.get('userName')
      },
    });
    // eslint-disable-next-line no-unused-vars
    const data = await response.json();
    setScore(data.user.points)
  };

  const deductPoints = async () => {
    const response = await fetch('http://localhost:3001/deductpoints', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        username: Cookies.get('userName')
      },
    });
    // eslint-disable-next-line no-unused-vars
    const data = await response.json();
    setScore(data.user.points)
  };
  
  const getYoutubeUrl = async () => {
    const response = await fetch('https://rr-back-end.onrender.com/form/csgodata');
    const data = await response.json();
    const randomIndex = Math.floor(Math.random() * data.form.length);
    setUrl(data.form[randomIndex].youtubeLink);
    setRank(data.form[randomIndex].rank);
    setPlayer(data.form[randomIndex].playerInfo)
  };

  useEffect(() => {
    getYoutubeUrl();
  }, []);

  const refresh = () => {
    getYoutubeUrl();
    setSelectedRank(null);
    setIsButtonDisabled(true);
    setShowModal(false);
  };

  const checkAnswer = () => {

    const rankList = [
      'Silver',
      'Silver Elite',
      'Gold Nova',
      'Master Guardian',
      'Distinguished Master Guardian',
      'Legendary Eagle',
      'Master Guardian Elite',
      'Supreme',
      'Global Elite',
    ];
    const rankIndex = rankList.indexOf(rank);
    const selectedRankIndex = rankList.indexOf(selectedRank);
    const distance = Math.abs(rankIndex - selectedRankIndex);

    if (rank === selectedRank) {
      setResult(check);
      let point = +2;
      setPoint(point);
      addPoints();
    } else if (distance === 1) {
      setResult(wrong);
      let point = +1;
      setPoint(1);
      Add1Points(point);
    } else {
      setResult(wrong);
      setPoint(-1);
      deductPoints();
    }
}

  return (
    <>
      {loggedIn ? (
        <>
          <div>
            <VideoPlayer url={youtubeUrl} />
          </div>
            {showModal && (
              <div className="modal">
                <div className="modal-content">
                  <span className="X" onClick={handleModal}>X</span>
                  <br />
                  <div className="modal-example">
                    <div>
                      <div className="modal-example-heading">Correct Rank</div>
                      <img
                        className="modal-example-image"
                        src={pic}
                        alt="Radiant"
                        width={100}
                      />
                    </div>
                    <div>
                      <div className="modal-example-heading">Your Guess</div>
                      <img
                        className="modal-example-image"
                        src={submittedRank}
                        alt="rank"
                        width={100}
                      />
                    </div>
                    <div>
                      <div className="modal-example-heading result-title">Result</div>
                      <img
                        className="modal-example-image wrong"
                        src={result}
                        alt="wrong"
                        width={70}
                      />
                      <p className="modal-example-wrong">{point} Point</p>
                    </div>
                  </div>
                  <br />
                  <br />
                  <p className="text">You currently have {score} points</p>
                  <br />
                  <p className="text">Credit: {player}</p>
                  <button
                    onClick={refresh}
                    className="submit-btn"
                  >
                    Next Video
                  </button>
                </div>
              </div>
            )}
        <div className="ranks">
          <RankImage rank="Silver" selectedRank={selectedRank} handleRankClick={handleRankClick} src={silver} />
          <RankImage rank="Silver Elite" selectedRank={selectedRank} handleRankClick={handleRankClick} src={se} />
          <RankImage rank="Gold Nova" selectedRank={selectedRank} handleRankClick={handleRankClick} src={nova} />
          <RankImage rank="Master Guardian" selectedRank={selectedRank} handleRankClick={handleRankClick} src={mg} />
          <RankImage rank="Master Guardian Elite" selectedRank={selectedRank} handleRankClick={handleRankClick} src={mge} />
          <RankImage rank="Distinguished Master Guardian" selectedRank={selectedRank} handleRankClick={handleRankClick} src={dmg} />
          <RankImage rank="Legendary Eagle" selectedRank={selectedRank} handleRankClick={handleRankClick} src={le} />
          <RankImage rank="Supreme" selectedRank={selectedRank} handleRankClick={handleRankClick} src={smfc} />
          <RankImage rank="Global Elite" selectedRank={selectedRank} handleRankClick={handleRankClick} src={ge} />
        </div>
        <div>
          <button
            className="submit"
            onClick={() => {
              handleModal();
              checkAnswer();
            }}
            disabled={isButtonDisabled}
          >
            {selectedRank
              ? `Selected Rank: ${selectedRank}`
              : 'Select a Rank'}
          </button>
        </div>
      </>
    ) : (
      <div>
        <h1>Please Login to play</h1>
      </div>
    )}
  </>
);
};

export default Csgo;
