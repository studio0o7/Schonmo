import Header from '../sections/Header';
import Hero from '../sections/Hero';
import Wheelsets from '../sections/Wheelsets';
import Framesets from '../sections/Framesets';
import About from '../sections/About';
import OrderForm from '../sections/OrderForm';
import Footer from '../sections/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Framesets />
      <Wheelsets />
      <About />
      <OrderForm />
      <Footer />
    </main>
  );
} 