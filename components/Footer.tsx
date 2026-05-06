import Link from 'next/link';
import { GlobeIcon, FacebookIcon, InstagramIcon } from './icons';

export default function Footer() {
  return (
    <footer>
      <div className="ftr__grid">
        <div className="ftr__col">
          <h4>Информация</h4>
          <ul>
            <li><Link href="#">За нас</Link></li>
            <li><Link href="#">Как работи платформата</Link></li>
            <li><Link href="#">Контакти</Link></li>
          </ul>
        </div>
        <div className="ftr__col">
          <h4>Имоти</h4>
          <ul>
            <li><Link href="#">Под наем</Link></li>
            <li><Link href="#">Покупко-продажба</Link></li>
            <li><Link href="#">От инвеститор</Link></li>
          </ul>
        </div>
        <div className="ftr__col">
          <h4>Помощ</h4>
          <ul>
            <li><Link href="#">Помощен център</Link></li>
            <li><Link href="#">Съвети за безопасност</Link></li>
            <li><Link href="#">Правила</Link></li>
          </ul>
        </div>
      </div>
      <div className="ftr__btm">
        <span className="ftr__copy">© 2025 FairSpace.</span>
        <div className="ftr__right">
          <span className="ftr__loc">
            <GlobeIcon />
            Български
          </span>
          <span className="ftr__loc">€ Евро</span>
          <div className="ftr__soc">
            <Link href="#" aria-label="Facebook"><FacebookIcon /></Link>
            <Link href="#" aria-label="Instagram"><InstagramIcon /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
