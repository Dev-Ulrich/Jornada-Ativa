import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'login.dart';
import 'escolhanivel.dart';
import 'treinosugeridos.dart';

void main() {
  runApp(const MyApp());
}

/// Classe principal do aplicativo
/// Responsável por definir as rotas e a tela inicial
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false, // Remove a faixa "debug"
      title: 'Jornada Ativa',

      theme: ThemeData(
        primaryColor: const Color(0xFFFF5B00), // Cor principal do app
        textTheme: GoogleFonts.interTextTheme(), // Fonte global
      ),

      // Define as rotas nomeadas usadas nas navegações
      routes: {
        '/': (context) => const Login(), // Tela inicial
        '/escolhanivel': (context) => const EscolhaNivel(), // Tela de escolha de nível
        '/treinossugeridos': (context) => const TreinosSugeridos(), // Tela de treinos
      },
    );
  }
}
