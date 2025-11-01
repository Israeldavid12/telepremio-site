import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [plays, setPlays] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      const { data: playsData } = await supabase
        .from("lottery_plays")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      setProfile(profileData);
      setPlays(playsData || []);
      setLoading(false);
    };

    fetchData();
  }, [navigate]);

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
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl font-black">Meu Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Nome</p>
                  <p className="font-bold">{profile?.full_name || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Telefone M-pesa</p>
                  <p className="font-bold">{profile?.phone_number || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total de Jogadas</p>
                  <p className="font-bold text-primary">{profile?.total_plays || 0}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Vitórias</p>
                  <p className="font-bold text-success">{profile?.total_wins || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl font-black">Histórico de Jogadas</CardTitle>
            </CardHeader>
            <CardContent>
              {plays.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Você ainda não fez nenhuma jogada
                </p>
              ) : (
                <div className="space-y-3">
                  {plays.map((play) => (
                    <div
                      key={play.id}
                      className="p-4 bg-muted rounded-lg flex items-center justify-between"
                    >
                      <div className="flex gap-2">
                        {play.selected_numbers.map((num: number, i: number) => (
                          <Badge key={i} variant="secondary" className="text-base">
                            {num}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            play.payment_status === "completed"
                              ? "default"
                              : play.payment_status === "failed"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {play.payment_status === "completed"
                            ? "Pago"
                            : play.payment_status === "failed"
                            ? "Falhou"
                            : "Pendente"}
                        </Badge>
                        {play.is_winner && (
                          <Badge variant="default" className="ml-2 bg-success">
                            Vencedor!
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
