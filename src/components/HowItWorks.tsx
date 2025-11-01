import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, CreditCard, Trophy } from "lucide-react";

const steps = [
  {
    icon: Sparkles,
    title: "Escolha seus Números",
    description: "Selecione 5 números da sorte entre 1 e 99",
  },
  {
    icon: CreditCard,
    title: "Pague com M-pesa",
    description: "Apenas 100MT por jogada, máximo 10 jogadas",
  },
  {
    icon: Trophy,
    title: "Ganhe Prêmios",
    description: "57% de chance de ganhar! Sorteio transparente",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">Como Funciona</h2>
          <p className="text-xl text-muted-foreground">
            É simples e rápido jogar no Teleprêmio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="text-center hover:shadow-card transition-smooth">
              <CardContent className="pt-8 pb-6">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary">
                  <step.icon className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
