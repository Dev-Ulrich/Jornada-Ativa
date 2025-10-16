// usuario_widget.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class UsuarioWidget extends StatelessWidget {
  const UsuarioWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[200],
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Cabeçalho com imagem e avatar
            Stack(
              children: [
                Container(
                  width: double.infinity,
                  height: 140,
                  decoration: const BoxDecoration(
                    image: DecorationImage(
                      fit: BoxFit.cover,
                      image: NetworkImage(
                          'https://th.bing.com/th/id/R.49266bf3dd016caccfe94cfce111d944?rik=54p6wBipZ4LAGQ&pid=ImgRaw&r=0'),
                    ),
                  ),
                ),
                Positioned(
                  bottom: 0,
                  left: 24,
                  child: Container(
                    width: 90,
                    height: 90,
                    decoration: BoxDecoration(
                      color: Colors.orange,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 2),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(50),
                      child: Image.asset('assets/images/qgrqz_J.png', fit: BoxFit.cover),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Usuario 01',
                      style: GoogleFonts.interTight(fontSize: 24, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text('usuario@email.com', style: GoogleFonts.inter(fontSize: 16)),
                  const SizedBox(height: 20),
                  // Card Meus Treinos
                  _buildCard(
                    context,
                    icon: Icons.directions_run,
                    title: 'Meus Treinos',
                    onTap: () {},
                  ),
                  const SizedBox(height: 12),
                  // Card Eventos
                  _buildCard(
                    context,
                    icon: Icons.people_alt_outlined,
                    title: 'Eventos',
                    onTap: () {},
                  ),
                  const SizedBox(height: 20),
                  Center(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        side: const BorderSide(color: Colors.red, width: 2),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(38)),
                        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
                      ),
                      onPressed: () {
                        Navigator.pushReplacementNamed(context, '/login');
                      },
                      child: Text('Log Out', style: GoogleFonts.inter(color: Colors.red, fontSize: 16)),
                    ),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCard(BuildContext context,
      {required IconData icon, required String title, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        height: 60,
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: const [BoxShadow(blurRadius: 3, color: Color(0x33000000), offset: Offset(0, 1))],
          borderRadius: BorderRadius.circular(8),
        ),
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            Icon(icon, color: const Color(0xFFFF5B00), size: 30),
            const SizedBox(width: 12),
            Text(title, style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600)),
            const Spacer(),
            const Icon(Icons.arrow_forward_ios, color: Colors.grey, size: 18),
          ],
        ),
      ),
    );
  }
}
