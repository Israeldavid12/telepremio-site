import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-lottery.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-black text-foreground drop-shadow-lg animate-fade-in">
            TELEPRÊMIO
          </h1>
          <p className="text-xl md:text-2xl text-foreground font-bold drop-shadow">
            Apenas 100MT por jogada! Escolha seus números da sorte e ganhe prêmios incríveis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/play">
              <Button size="lg" variant="hero" className="text-lg px-8 py-6 h-auto">
                Jogar Agora
              </Button>
            </Link>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto">
              Como Funciona
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
