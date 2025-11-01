import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import minibusImage from "@/assets/prize-minibus.jpg";
import diningImage from "@/assets/prize-dining.jpg";
import tvImage from "@/assets/prize-tv.jpg";
import sofaImage from "@/assets/prize-sofa.jpg";
import bedImage from "@/assets/prize-bed.jpg";

const prizes = [
  {
    name: "Mini Bus",
    value: "1.500.000 MT",
    image: minibusImage,
    featured: true,
  },
  {
    name: "Mesa com 6 Cadeiras",
    value: "25.000 MT",
    image: diningImage,
  },
  {
    name: "TV 42 Polegadas",
    value: "25.000 MT",
    image: tvImage,
  },
  {
    name: "Jogo de Sofá",
    value: "35.000 MT",
    image: sofaImage,
  },
  {
    name: "Cama de Casal",
    value: "20.000 MT",
    image: bedImage,
  },
];

const PrizesShowcase = () => {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">Prêmios Incríveis</h2>
          <p className="text-xl text-muted-foreground">
            Confira o que você pode ganhar com apenas 100MT
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prizes.map((prize, index) => (
            <Card 
              key={index} 
              className={`overflow-hidden hover:shadow-glow transition-smooth ${
                prize.featured ? "md:col-span-2 lg:col-span-3" : ""
              }`}
            >
              <div className={`relative ${prize.featured ? "h-96" : "h-64"}`}>
                <img
                  src={prize.image}
                  alt={prize.name}
                  className="w-full h-full object-cover"
                />
                {prize.featured && (
                  <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground text-lg px-4 py-2">
                    Prêmio Principal
                  </Badge>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">{prize.name}</h3>
                <p className="text-xl text-primary font-bold">{prize.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrizesShowcase;
