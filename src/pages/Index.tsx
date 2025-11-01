import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PrizesShowcase from "@/components/PrizesShowcase";
import HowItWorks from "@/components/HowItWorks";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <PrizesShowcase />
      <HowItWorks />
      <footer className="bg-foreground text-background py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-bold">© 2025 Teleprêmio - Todos os direitos reservados</p>
          <p className="text-sm mt-2">Jogue com responsabilidade</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
