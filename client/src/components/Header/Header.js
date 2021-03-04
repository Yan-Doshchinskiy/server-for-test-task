import routes from '../../routes'
import Logo from './assets/logo.png'

const Header = () => (
  <header>
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{ backgroundColor: '#e3f2fd' }}
    >
      <div className="container-fluid">
        <div className="p-1 me-2">
          <img
            src={Logo}
            alt="logo"
            style={{ width: '158px', height: '65px' }}
          />
        </div>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {routes.map((link) => (
              <li className="nav-item" key={link.id}>
                <a className="nav-link" href={link.path}>
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  </header>
)

export default Header
