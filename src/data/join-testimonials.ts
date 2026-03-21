/** Student testimonials for the Join 4C Lab page (aligned with 4c-research-group). */
export type JoinTestimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  bio: string;
  education: string;
  /** Path under `public`; omit for initials placeholder */
  imageSrc?: string;
};

export const joinTestimonials: JoinTestimonial[] = [
  {
    id: "julia",
    name: "Julia",
    role: "DDS Student",
    quote:
      "Working with Dr. Ganesan's lab during my clinical rotation has been a valuable experience that I am extremely grateful for. Being immersed in the realm of critical care over the span of 8 weeks allowed me to gain insight into how research is conducted at the bedside. It was evident that Dr. Ganesan, Maysaa, and the lab team strongly value mentorship, as they were always very supportive and available to provide my team and I with guidance on our research projects and in between observership sessions. I look forward to continue working on my research project with the 4C research group, and will carry forth my knowledge regarding pediatric care, and the environmental impact of anesthetics into my future career as a (hopefully pediatric) dentist!",
    bio: "Julia completed her BSc. (Honours) in Behaviour, Cognition, and Neuroscience at the University of Windsor, and her MSc. in Interdisciplinary Medical Sciences at Western University where she completed her clinical rotation under the supervision of Dr. Ganesan. In Fall 2024, she started her first year of the Doctor of Dental Surgery (DDS) program at the Schulich School of Medicine and Dentistry at Western University.",
    education:
      "BSc (Honours) in Behaviour, Cognition, and Neuroscience, University of Windsor; MSc in Interdisciplinary Medical Sciences, Western University; DDS Student at Schulich School of Medicine and Dentistry, Western University",
    imageSrc: "/team/team-12.jpg",
  },
  {
    id: "devorah",
    name: "Devorah",
    role: "Research Assistant",
    quote:
      "I had the privilege of working under the supervision of Dr. Ganesan, alongside three classmates, as a component of my master's program at Western University. I was lucky to be welcomed so generously by Dr. Ganesan, Maysaa, and the graduate students in the lab. In the process of collaborating on various projects of the lab, with a focus on the Predict-ABI study, I learned about clinical research protocols as well as skills in applying fNIRS and EEG functional neuroimaging techniques. One of my favorite parts of the rotation was shadowing Dr. Ganesan in the PCCU during rounds! Dr. Ganesan is an excellent mentor. Their willingness to support me as a student and their investment in my success was what made the experience one-of-a-kind!",
    bio: "Devorah completed her undergraduate degree in cognitive and developmental neurosciences (BSc) at Western University, and a master's in interdisciplinary medical sciences (MSC) at Western University. Through her education, Devorah has gained several translational and technical skills that she hopes to apply in her future career in healthcare.",
    education:
      "BSc in Cognitive and Developmental Neurosciences, Western University; MSc in Interdisciplinary Medical Sciences, Western University",
    imageSrc: "/team/team-13.jpg",
  },
  {
    id: "daniela",
    name: "Daniela",
    role: "Research Assistant",
    quote:
      "I had the pleasure of having Dr. Ganesan as my supervisor during my clinical-based rotation as a component of my MSc. in Interdisciplinary Medical Sciences. This opportunity was highly insightful and allowed me to gain exposure to various aspects of clinic research, such as consent and the REB application process. Dr. Ganesan, Maysaa, and all the other lab members were extremely welcoming to my group and I and were very helpful throughout the rotation as we navigated this new environment. I could not be more grateful to have been paired with Dr. Ganesan and look forward to what my future brings as a Research Assistant with the lab!",
    bio: "Daniela completed her Bachelor of Life Sciences (Honours) degree at McMaster University and went on to complete her MSc. In Interdisciplinary Medical Sciences at the University of Western Ontario. Through her master's program, she completed a clinical-based rotation, where she was able to gain shadowing and research experience. Daniela will now be continuing to pursue her research interests in Dr. Ganesan's lab as a Research Assistant.",
    education:
      "BSc (Honours) in Life Sciences, McMaster University; MSc in Interdisciplinary Medical Sciences, Western University",
    imageSrc: "/team/team-9.jpg",
  },
  {
    id: "hafsa",
    name: "Hafsa",
    role: "MSc Student",
    quote:
      "I had the privilege of completing my clinical research rotation under the supervision of Dr. Ganesan as part of my master's program. This experience has been extremely rewarding as I've gotten the opportunity to gain insight into clinical research and the vital role it plays in the PCCU. I was able to learn about the use of various functional neuroimaging tools and everything that goes into the implementation phase of a research project. Dr. Ganesan, Maysaa and all other lab members were a wonderful group to work with. I will always be grateful for their support and mentorship as I continue with my learning journey.",
    bio: "Hafsa completed her bachelor's in psychology, Neuroscience, and behaviour at McMaster University. She is currently completing her MSc. in Interdisciplinary Medical Sciences at the University of Western Ontario. Her research interests focus on neuroscience, child health and improving health outcomes in marginalized populations.",
    education:
      "BSc in Psychology, Neuroscience, and Behaviour, McMaster University; Current MSc Student in Interdisciplinary Medical Sciences, Western University",
  },
];
