import 'package:flutter/material.dart';
// import 'package:google_fonts/google_fonts.dart';
import 'package:google_fonts/google_fonts.dart';

/// Tela que exibe os treinos recomendados para o usuário
/// após ele escolher seu nível
class TreinosSugeridos extends StatelessWidget {
  const TreinosSugeridos({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Treinos Sugeridos',
          style: GoogleFonts.interTight(fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFFFF5B00),
        foregroundColor: Colors.white,
      ),

      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Bem-vindo à sua jornada!",
              style: GoogleFonts.interTight(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              "Aqui estão os treinos sugeridos de acordo com o seu nível:",
              style: GoogleFonts.inter(fontSize: 16),
            ),
            const SizedBox(height: 20),

            // Lista rolável de treinos
            Expanded(
              child: ListView(
                children: [
                  _buildTreinoCard(
                    icon: Icons.fitness_center,
                    titulo: "Colocar treino",
                    descricao:
                        "descricacao",
                  ),
                  _buildTreinoCard(
                    icon: Icons.directions_run,
                    titulo: "Colocar treino",
                    descricao:
                        "eescricao.",
                  ),
                  _buildTreinoCard(
                    icon: Icons.self_improvement,
                    titulo: "Colocar treino",
                    descricao:
                        "descricao.",
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Botão de voltar
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFF5B00),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                onPressed: () => Navigator.pushNamed(context, '/'),
                child: Text(
                  "Voltar ao Início",
                  style: GoogleFonts.interTight(
                    fontSize: 16,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Função auxiliar que cria os cards dos treinos
  Widget _buildTreinoCard({
    required IconData icon,
    required String titulo,
    required String descricao,
  }) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 3,
      child: ListTile(
        leading: Icon(icon, color: const Color(0xFFFF5B00)),
        title: Text(
          titulo,
          style: GoogleFonts.interTight(fontWeight: FontWeight.w600),
        ),
        subtitle: Text(descricao, style: GoogleFonts.inter()),
      ),
    );
  }
}
