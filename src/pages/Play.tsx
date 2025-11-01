import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Loader2 } from "lucide-react";


const Play = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [plays, setPlays] = useState<number[][]>([]);

  const genTokenApi = async () => {
    try {
      const url = 'https://payment.droopay.com/api/oauth/token'
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: 'c0f280e4-7e71-4711-ae4c-745dba742d17',
          client_secret: 'pY2c_jToRW4GXpK7B8HXM'
        })
      })

      const data = await res.json();
      console.log(data);
      return data.access_token;
    } catch (error) {
      console.log(error)
      toast.error("Erro ao gerar token de pagamento.");
    }

  }

  const handlePaymentMpesa = async () => {
    try {
      const token = await genTokenApi();
      console.log("Token:", token);
      if (!token) {
        toast.error("Token de pagamento inválido.");
        return;
      }
      const url = 'https://payment.droopay.com/api/open/payment/mpesa/live';
      const res = await fetch(url, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: 1,
          payment_number: (user.user_metadata.phone_number).substring(3),
        })
      })
      const data = await res.json();
      if(data.status == "201" || data.transaction_ID) {
        toast.success("Pagamento completado.");
        // Add plays to the database
        const { error } = await supabase
          .from('lottery_plays')
          .insert(
            plays.map(numbers => ({
              user_id: user.id,
              selected_numbers: numbers,
              mpesa_transaction_id: data.transaction_ID,
              amount_mt: 100,
              payment_status: 'completed',
              is_winner: false,
              matched_numbers: 0
            }))
          );

        if (error) {
          console.error("Error saving plays:", error);
          toast.error("Erro ao salvar jogadas. Por favor, contacte o suporte.");
          return;
        }

        // Clear plays after successful save
        setPlays([]);
        toast.success("Jogadas registradas com sucesso!");
      }

  
      console.log(data.status);
      toast.success("Pagamento iniciado! Verifique seu telefone.");
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });
  }, [navigate]);

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else if (selectedNumbers.length < 5) {
      setSelectedNumbers([...selectedNumbers, num]);
    } else {
      toast.error("Você já selecionou 5 números!");
    }
  };

  const addPlay = () => {
    if (selectedNumbers.length !== 5) {
      toast.error("Selecione exatamente 5 números!");
      return;
    }
    if (plays.length >= 10) {
      toast.error("Máximo de 10 jogadas por vez!");
      return;
    }
    setPlays([...plays, [...selectedNumbers]]);
    setSelectedNumbers([]);
    toast.success("Jogada adicionada!");
  };

  const removePlay = (index: number) => {
    setPlays(plays.filter((_, i) => i !== index));
  };

  const handlePayment = async () => {
    if (plays.length === 0) {
      toast.error("Adicione pelo menos uma jogada!");
      return;
    }

    toast.info("Processando pagamento M-pesa...");
    // Payment logic will be implemented in edge function
    handlePaymentMpesa()
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-sky flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-sky">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto shadow-card">
          <CardHeader>
            <CardTitle className="text-3xl font-black">Escolha Seus Números da Sorte</CardTitle>
            <CardDescription>
              Selecione 5 números entre 1 e 99. Máximo 10 jogadas (100MT cada).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-bold mb-3">
                Selecionados: {selectedNumbers.length}/5
              </h3>
              <div className="grid grid-cols-10 gap-2">
                {Array.from({ length: 99 }, (_, i) => i + 1).map((num) => (
                  <Button
                    key={num}
                    variant={selectedNumbers.includes(num) ? "hero" : "outline"}
                    size="sm"
                    onClick={() => toggleNumber(num)}
                    className="aspect-square p-0"
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={addPlay}
              variant="hero"
              className="w-full"
              disabled={selectedNumbers.length !== 5}
            >
              Adicionar Jogada (100MT)
            </Button>

            {plays.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold">Suas Jogadas ({plays.length}/10)</h3>
                {plays.map((play, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex gap-2">
                      {play.map((num, i) => (
                        <Badge key={i} variant="secondary" className="text-base">
                          {num}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removePlay(index)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}

                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">{plays.length * 100} MT</span>
                  </div>
                  <Button
                    onClick={handlePayment}
                    variant="success"
                    size="lg"
                    className="w-full"
                  >
                    Pagar com M-pesa
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Play;
