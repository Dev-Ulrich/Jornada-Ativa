import 'package:flutter/material.dart';

/// Tela onde o usuário escolhe o nível de treino:
/// Iniciante, Intermediário ou Avançado
class EscolhaNivel extends StatefulWidget {
  const EscolhaNivel({super.key});

  @override
  State<EscolhaNivel> createState() => _EscolhaNivelState();
}

class _EscolhaNivelState extends State<EscolhaNivel> {
  /// Função que navega para a tela de treinos sugeridos
  void _navigateToTreinos() {
    Navigator.pushNamed(context, '/treinossugeridos');
  }

  /// Cria um botão de seleção de nível com título e descrição
  Widget _buildNivelButton({
    required String title,
    required String subtitle,
    required VoidCallback onPressed,
  }) {
    return Column(
      children: [
        ElevatedButton(
          onPressed: onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFFF5B00),
            minimumSize: const Size(double.infinity, 130),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          child: Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
          ),
        ),
        const SizedBox(height: 10),
        Text(
          subtitle,
          textAlign: TextAlign.center,
          style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w500),
        ),
        const SizedBox(height: 30),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Selecione seu Nível:"),
        backgroundColor: Colors.black,
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 20),
            const Text(
              'Para te ajudar, nosso app classifica os corredores em três níveis:',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 30),

            // Botões de nível
            _buildNivelButton(
              title: 'Iniciante',
              subtitle:
                  'Para quem está começando.\n✅ Caminhadas e trotes leves.',
              onPressed: _navigateToTreinos,
            ),
            _buildNivelButton(
              title: 'Intermediário',
              subtitle:
                  'Para quem já corre e quer evoluir.\n🏃‍♂️ Treinos variados e moderados.',
              onPressed: _navigateToTreinos,
            ),
            _buildNivelButton(
              title: 'Avançado / Atleta',
              subtitle:
                  'Para quem busca performance.\n🔥 Treinos específicos e intensos.',
              onPressed: _navigateToTreinos,
            ),
          ],
        ),
      ),
    );
  }
}
