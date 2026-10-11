// File ini khusus untuk menyimpan data portofolio Anda berdasarkan KATEGORI.
// Halaman utama hanya akan menampilkan Kategori.
// Ketika kategori diklik, pop-up akan menampilkan semua proyek di dalam kategori tersebut.

const portfolioCategories = [
    {
        id: "category-mobile",
        title: "Mobile App Development",
        description: "Kumpulan proyek pengembangan aplikasi mobile yang berfokus pada performa tinggi dan antarmuka modern.",
        thumbnail: "https://i.pinimg.com/736x/f7/ee/b9/f7eeb98c91da110c4700f59b993eccbd.jpg", // Gambar cover kategori di halaman utama
        projects: [
            {
                title: "Any Project Mobile App",
                year: "2026",
                tech: "Flutter & Dart",
                description: "A mobile application built with Flutter & Dart. Designed with a strong focus on blazing-fast performance and a highly clean, modern user interface.",
                images: [
                    "https://i.pinimg.com/736x/f7/ee/b9/f7eeb98c91da110c4700f59b993eccbd.jpg"
                ]
            },
            {
                title:"School Practice: Flutter Auth & Calculator App",
                year: "2026",
                tech: "Flutter & Dart",
                description: "A vocational school project built with Flutter & Dart, implementing modular reusable components, complete user registration-login flow, and a functional calculator utility.":,
                images: []
            }
            // KEDEPANNYA: Anda bisa menambahkan proyek mobile ke-2, ke-3 dst di sini!
            /*
            ,
            {
                title: "Aplikasi Kasir Mobile",
                year: "2027",
                tech: "React Native",
                description: "Deskripsi aplikasi...",
                images: ["foto1.jpg", "foto2.jpg"]
            }
            */
        ]
    },
    {
        id: "category-design",
        title: "UI/UX & Graphic Design",
        description: "Kumpulan eksplorasi desain visual, wireframing, dan prototype interaktif.",
        thumbnail: "public/fotoproject/Poster.webp",
        projects: [
            {
                title: "Typograph Design",
                year: "2026",
                tech: "Figma",
                description: "A comprehensive UI/UX design project crafted in Figma. This includes extensive user research, low-fidelity wireframing, interactive prototyping, and promotional poster designs for marketing needs.",
                images: [
                    "fotoproject/Poster.webp"
                ]
            },
            {
                title: "Student Attendance App UI/UX Design",
                year: "2026",
                tech: "Figma",
                description: "A clean and intuitive mobile app interface designed in Figma to streamline student attendance tracking and classroom management.",
                images: [
                    "fotoproject/disenappabsen.png"
                ]
            }
        ]
    }

];
