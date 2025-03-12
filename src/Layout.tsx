import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './Layout.css';

export function Layout() {
    return (
        <div className='body-wrap'>
            <div className='header-wrap'>
                <Header />
            </div>
            <div className='content-wrap'>
                <Main />
            </div>
            <div className='footer-wrap'>
                <Footer />
            </div>
        </div>
    );
}