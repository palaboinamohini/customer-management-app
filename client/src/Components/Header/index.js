import {Link} from 'react-router-dom'
import './index.css'

const Header = () => (
    <header className='header-bg-container'>
        <div className='header-container'>
            <Link to="/">
                <button className='header-button'>Customer</button>
            </Link>
            <Link to="/customers/new">
                <button className='header-button'>New Customer</button>
            </Link>
        </div>
    </header>
)

export default Header