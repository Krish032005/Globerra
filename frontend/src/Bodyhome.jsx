import img1 from './assets/BaliBeach.avif';
import img11 from './assets/Tokyo.avif';
import img12 from './assets/Barcelona.avif';
import img2 from './assets/Muntfuji.avif';

import Tourcards from './Tourcards';
import img3 from './assets/HongKong.avif';
import img31 from './assets/Dubai.avif';
import img21 from './assets/Santorini.avif';
import img22 from './assets/Frankfurt.avif';
import './Bodyhome.css';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

export default function Bodyhome() {
    const navigate = useNavigate();

    const handlePlaceClick = (placeName) => {
        navigate('/dashboard', { state: { destination: placeName } });
    };

    return (
        <>
            <Tourcards />
            <div className="outer-country">

                <div className="inner-country">
                    <h1 id='inner-h1'>Trending Destination</h1>

                    <div className="country-container">
                        <div className="country-card" onClick={() => handlePlaceClick("Bali")}>
                            <img src={img1} alt="Bali" />
                            <h1 className='card-text text-center'>Bali</h1>
                        </div>
                        <div className="country-card" onClick={() => handlePlaceClick("Tokyo")}>
                            <img src={img11} alt="Tokyo" />
                            <h1 className='card-text text-center'>Tokyo</h1>
                        </div>
                        <div className="country-card" onClick={() => handlePlaceClick("Barcelona")}>
                            <img src={img12} alt="Bridge" />
                            <h1 className='card-text text-center'>Barcelona</h1>
                        </div>
                        <div className="country-card" onClick={() => handlePlaceClick("Mount Fuji")}>
                            <img src={img2} alt="Bridge" />
                            <h1 className='card-text text-center'>Mount Fuji</h1>
                        </div>
                    </div>

                    <div className="country-container country-second">
                        <div className="country-card" onClick={() => handlePlaceClick("Hong Kong")}>
                            <img src={img3} alt="England" />
                            <h1 className='card-text text-center'>Hong Kong</h1>
                        </div>
                        <div className="country-card" onClick={() => handlePlaceClick("Dubai")}>
                            <img src={img31} alt="London" />
                            <h1 className='card-text text-center'>Dubai</h1>
                        </div>
                        <div className="country-card" onClick={() => handlePlaceClick("Santorini")}>
                            <img src={img21} alt="Rome" />
                            <h1 className='card-text text-center'>Santorini</h1>
                        </div>
                        <div className="country-card" onClick={() => handlePlaceClick("Frankfurt")}>
                            <img src={img22} alt="Australia" />
                            <h1 className='card-text text-center'>FrankFurt</h1>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}