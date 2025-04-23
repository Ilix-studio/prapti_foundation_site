import myDog from "./../assets/C.jpeg";

export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: "Male" | "Female";
  size: "Small" | "Medium" | "Large";
  temperament: string[];
  description: string;
  image: string;
  adoptionStatus: "Available" | "Pending" | "Adopted";
  goodWith: {
    children: boolean;
    dogs: boolean;
    cats: boolean;
  };
  medicalNeeds: string[];
  trainingLevel: "Untrained" | "Basic" | "Well-trained";
}

export const dogs: Dog[] = [
  {
    id: "buddy-1",
    name: "Buddy",
    breed: "Indian Pariah / Mix",
    age: "2 years",
    gender: "Male",
    size: "Medium",
    temperament: ["Friendly", "Energetic", "Playful"],
    description:
      "Buddy is a cheerful and energetic dog who loves to play. He was rescued from the streets of Golaghat and has been with us for 6 months. Buddy gets along well with other dogs and would thrive in an active home with a yard where he can run and play.",
    image: myDog,
    adoptionStatus: "Available",
    goodWith: {
      children: true,
      dogs: true,
      cats: false,
    },
    medicalNeeds: [],
    trainingLevel: "Basic",
  },
  {
    id: "luna-2",
    name: "Luna",
    breed: "Indian Spitz / Mix",
    age: "1 year",
    gender: "Female",
    size: "Small",
    temperament: ["Gentle", "Affectionate", "Shy"],
    description:
      "Luna is a sweet and gentle dog who loves cuddles. She was found abandoned near a local market. Initially shy, she warms up quickly once she trusts you. Luna would do best in a quiet home with patient owners who can help build her confidence.",
    image: myDog,
    adoptionStatus: "Available",
    goodWith: {
      children: true,
      dogs: true,
      cats: true,
    },
    medicalNeeds: [],
    trainingLevel: "Basic",
  },
  {
    id: "rocky-3",
    name: "Rocky",
    breed: "Labrador / Mix",
    age: "3 years",
    gender: "Male",
    size: "Large",
    temperament: ["Loyal", "Intelligent", "Protective"],
    description:
      "Rocky is a loyal and intelligent dog who forms strong bonds with his humans. He was surrendered by his previous owner who could no longer care for him. Rocky has good obedience training and would make an excellent companion for an experienced dog owner.",
    image: myDog,
    adoptionStatus: "Pending",
    goodWith: {
      children: true,
      dogs: true,
      cats: false,
    },
    medicalNeeds: ["Regular exercise needed for joint health"],
    trainingLevel: "Well-trained",
  },
  {
    id: "daisy-4",
    name: "Daisy",
    breed: "Indian Pariah / Mix",
    age: "4 months",
    gender: "Female",
    size: "Small",
    temperament: ["Playful", "Curious", "Adaptable"],
    description:
      "Daisy is a playful puppy full of curiosity and joy. She was part of a litter rescued from a construction site. Daisy is learning basic commands and is very food-motivated, making her easy to train. She would thrive in a home with people who have time to provide training and socialization.",
    image: myDog,
    adoptionStatus: "Available",
    goodWith: {
      children: true,
      dogs: true,
      cats: true,
    },
    medicalNeeds: ["Scheduled for final vaccinations"],
    trainingLevel: "Untrained",
  },
  {
    id: "max-5",
    name: "Max",
    breed: "German Shepherd / Mix",
    age: "5 years",
    gender: "Male",
    size: "Large",
    temperament: ["Calm", "Loyal", "Intelligent"],
    description:
      "Max is a dignified and calm dog with a loyal heart. He was rescued after being found tied to a tree in a forest. Despite his difficult past, Max is gentle and trusting. He would do best in a home with a structured routine and an owner who appreciates his intelligence.",
    image: myDog,
    adoptionStatus: "Available",
    goodWith: {
      children: true,
      dogs: false,
      cats: false,
    },
    medicalNeeds: ["Arthritis medication"],
    trainingLevel: "Well-trained",
  },
  {
    id: "bella-6",
    name: "Bella",
    breed: "Indian Pariah / Mix",
    age: "2 years",
    gender: "Female",
    size: "Medium",
    temperament: ["Energetic", "Smart", "Loving"],
    description:
      "Bella is an energetic and smart dog who loves to learn new tricks. She was rescued during a local flood. Bella forms strong bonds with her humans and is always eager to please. She would thrive in an active home where she can get plenty of exercise and mental stimulation.",
    image: myDog,
    adoptionStatus: "Adopted",
    goodWith: {
      children: true,
      dogs: true,
      cats: true,
    },
    medicalNeeds: [],
    trainingLevel: "Well-trained",
  },
  {
    id: "charlie-7",
    name: "Charlie",
    breed: "Indie / Mix",
    age: "1 year",
    gender: "Male",
    size: "Medium",
    temperament: ["Playful", "Social", "Curious"],
    description:
      "Charlie is a playful and social young dog who enjoys the company of both humans and other dogs. He was rescued from a busy highway. Charlie is quick to learn and eager to please. He would do well in a family that can provide him with plenty of play time and socialization.",
    image: myDog,
    adoptionStatus: "Available",
    goodWith: {
      children: true,
      dogs: true,
      cats: false,
    },
    medicalNeeds: [],
    trainingLevel: "Basic",
  },
  {
    id: "lucy-8",
    name: "Lucy",
    breed: "Retriever / Mix",
    age: "4 years",
    gender: "Female",
    size: "Medium",
    temperament: ["Gentle", "Patient", "Loving"],
    description:
      "Lucy is a gentle and patient dog with a loving heart. She was surrendered when her family moved abroad. Lucy has lived with children and is exceptionally patient and gentle. She would make a wonderful family dog or companion for someone looking for a calm and affectionate friend.",
    image: myDog,
    adoptionStatus: "Available",
    goodWith: {
      children: true,
      dogs: true,
      cats: true,
    },
    medicalNeeds: [],
    trainingLevel: "Well-trained",
  },
  {
    id: "cooper-9",
    name: "Cooper",
    breed: "Indian Spitz / Mix",
    age: "7 months",
    gender: "Male",
    size: "Small",
    temperament: ["Energetic", "Playful", "Curious"],
    description:
      "Cooper is an energetic puppy with a playful spirit. He was found wandering in a local park. Cooper is in the process of learning basic commands and is showing great progress. He would do best in a home with people who have time and patience for a young, energetic dog.",
    image: myDog,
    adoptionStatus: "Available",
    goodWith: {
      children: true,
      dogs: true,
      cats: false,
    },
    medicalNeeds: [],
    trainingLevel: "Untrained",
  },
  {
    id: "sadie-10",
    name: "Sadie",
    breed: "Indian Pariah / Mix",
    age: "6 years",
    gender: "Female",
    size: "Medium",
    temperament: ["Calm", "Independent", "Loyal"],
    description:
      "Sadie is a calm and independent dog who forms strong bonds with her humans. She was rescued from a neglectful situation. Sadie enjoys quiet walks and lounging in the sun. She would thrive in a peaceful home with a predictable routine and gentle owners.",
    image: myDog,
    adoptionStatus: "Available",
    goodWith: {
      children: false,
      dogs: false,
      cats: true,
    },
    medicalNeeds: ["Thyroid medication"],
    trainingLevel: "Basic",
  },
  {
    id: "oliver-11",
    name: "Oliver",
    breed: "Labrador / Mix",
    age: "3 years",
    gender: "Male",
    size: "Large",
    temperament: ["Friendly", "Outgoing", "Playful"],
    description:
      "Oliver is a friendly and outgoing dog who loves to be around people. He was surrendered when his owner fell ill. Oliver enjoys playing fetch and going for long walks. He would do well in an active family that can give him plenty of exercise and attention.",
    image: myDog,
    adoptionStatus: "Available",
    goodWith: {
      children: true,
      dogs: true,
      cats: false,
    },
    medicalNeeds: [],
    trainingLevel: "Well-trained",
  },
  {
    id: "molly-12",
    name: "Molly",
    breed: "Indian Pariah / Mix",
    age: "5 months",
    gender: "Female",
    size: "Small",
    temperament: ["Sweet", "Playful", "Adaptable"],
    description:
      "Molly is a sweet puppy with a playful personality. She was found with her siblings near a local temple. Molly is learning basic commands and is very food-motivated. She would thrive in a home with people who have time for training and socialization.",
    image: myDog,
    adoptionStatus: "Available",
    goodWith: {
      children: true,
      dogs: true,
      cats: true,
    },
    medicalNeeds: ["Final vaccinations scheduled"],
    trainingLevel: "Untrained",
  },
];

// Function to get available dogs only
export const getAvailableDogs = (): Dog[] => {
  return dogs.filter((dog) => dog.adoptionStatus === "Available");
};

// Function to get dogs by size
export const getDogsBySize = (size: "Small" | "Medium" | "Large"): Dog[] => {
  return dogs.filter((dog) => dog.size === size);
};

// Function to get dogs by compatibility
export const getDogsByCompatibility = (criteria: {
  goodWithChildren?: boolean;
  goodWithDogs?: boolean;
  goodWithCats?: boolean;
}): Dog[] => {
  return dogs.filter((dog) => {
    let match = true;

    if (criteria.goodWithChildren !== undefined) {
      match = match && dog.goodWith.children === criteria.goodWithChildren;
    }

    if (criteria.goodWithDogs !== undefined) {
      match = match && dog.goodWith.dogs === criteria.goodWithDogs;
    }

    if (criteria.goodWithCats !== undefined) {
      match = match && dog.goodWith.cats === criteria.goodWithCats;
    }

    return match;
  });
};
