import("/static/javascript/typeResponse/typeTournament.js")
  .then(module => {
    window.typeTournament = module.typeTournament;
    console.log("Module importé : ", typeTournament);
  })
  .catch(error => console.error("Erreur d'import :", error));

typeTournament({action: 0, exist: true, isFull: false, started: false, code: "45FD53"});

typeTournament({action: 1, id: 3, username: "NeoWander", pfp: "https://www.japanfm.fr/wp-content/uploads/2023/12/gojo-satoru-jjk-scaled.jpg"});
typeTournament({action: 1, id: 4, username: "SkyVolt", pfp: "https://i.seadn.io/gae/jCQAQBNKmnS_AZ_2jTqBgBLIVYaRFxLX6COWo-HCHrYJ1cg04oBgDfHvOmpqsWbmUaSfBDHIdrwKtGnte3Ph_VwQPJYJ6VFtAf5B?auto=format&dpr=1&w=1000"});
typeTournament({action: 1, id: 5, username: "QuantumFlare", pfp: "https://wallpapers-clan.com/wp-content/uploads/2022/09/one-piece-pfp-1.jpg"});
typeTournament({action: 1, id: 6, username: "PixelWhale", pfp: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5e5ff9cd-a751-4cd4-b9c5-00aa21620b7b/deu3q3u-6f1ca041-b5b7-46d7-ab06-f8547a7114cc.jpg/v1/fill/w_748,h_734,q_75,strp/cool_pfp_for_anyone__by_snowierev_deu3q3u-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzM0IiwicGF0aCI6IlwvZlwvNWU1ZmY5Y2QtYTc1MS00Y2Q0LWI5YzUtMDBhYTIxNjIwYjdiXC9kZXUzcTN1LTZmMWNhMDQxLWI1YjctNDZkNy1hYjA2LWY4NTQ3YTcxMTRjYy5qcGciLCJ3aWR0aCI6Ijw9NzQ4In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.bIIhpuZAj8GkKnWaCQ-QqVf-q58InCQZthNWr5mno7w"});
typeTournament({action: 1, id: 7, username: "NovaBlaze", pfp: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdyTh5ljvubR6s3LeERqK8DHldWwD3DcwBLw&s"});
typeTournament({action: 1, id: 8, username: "GlitchPhantom", pfp: "https://images.wondershare.com/filmora/article-images/2022/cool-tiktok-pfp.jpg"});
typeTournament({action: 1, id: 9, username: "FrostBiteX", pfp: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJWyvMlk1053PLnD3PRrz2g_LdQtW2H-M-GQ&s"});
typeTournament({action: 1, id: 10, username: "LunarEcho", pfp: "https://hypixel.net/attachments/1928357/"});
typeTournament({action: 2, id: 3});

typeTournament({action: 3, username: "Eddy", message: "Bonsoir"});

typeTournament({action: 4, id:4, username: "Zouave"});