//libs
import Image from 'next/image'

//style and images
import style from './footer.module.scss'
import bgShape from '@/assets/images/bg-shape.png'

const Footer = () => {
  return (
    <>
      <div className={style.bg_shape}>
        <Image src={bgShape} alt="Background Shapes" />
      </div>
    </>
  );
};

export default Footer;
