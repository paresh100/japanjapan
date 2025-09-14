'use client';
import React, { useState, useEffect, useCallback } from 'react';

// --- Type Definitions ---
type Word = {
    japanese: string;
    romaji: string;
    pronunciation: string;
    english: string;
    mnemonic: string;
    category: string;
};

type QuizQuestion = {
    question: string;
    options: Word[];
    answer: string;
    mnemonic: string;
};


// --- Data ---
const initialJapaneseWords: Word[] = [
    // Greetings (6)
    {
        japanese: "こんにちは",
        romaji: "Konnichiwa",
        pronunciation: "kohn-nee-chee-wah",
        english: "Hello / Good afternoon",
        mnemonic: "Connect 'Konnichiwa' to 'Cone of nachos.' Picture someone greeting you with a cone of nachos!",
        category: "Greetings"
    },
    {
        japanese: "おはようございます",
        romaji: "Ohayou gozaimasu",
        pronunciation: "oh-ha-yoh goh-zai-mass",
        english: "Good morning",
        mnemonic: "'Ohayo' sounds like 'Ohio,' imagine saying 'Good morning' to the entire state of Ohio.",
        category: "Greetings"
    },
    {
        japanese: "こんばんは",
        romaji: "Konbanwa",
        pronunciation: "kohn-bahn-wah",
        english: "Good evening",
        mnemonic: "Think of a 'convertible bond' driving by in the evening. 'Konbanwa'!",
        category: "Greetings"
    },
    {
        japanese: "さようなら",
        romaji: "Sayounara",
        pronunciation: "sah-yoh-nah-rah",
        english: "Goodbye",
        mnemonic: "Imagine saying 'See ya Nara!' when leaving the city of Nara.",
        category: "Greetings"
    },
    {
        japanese: "はじめまして",
        romaji: "Hajimemashite",
        pronunciation: "hah-jee-meh-mah-shee-teh",
        english: "Nice to meet you",
        mnemonic: "When you meet someone, you 'Hash a big mash' of potatoes together.",
        category: "Greetings"
    },
    {
        japanese: "お元気ですか",
        romaji: "Ogenki desu ka?",
        pronunciation: "oh-gen-kee dess kah",
        english: "How are you?",
        mnemonic: "'Oh Genki?' sounds like asking a genie named Genki how he is.",
        category: "Greetings"
    },

    // Essentials (10)
    {
        japanese: "ありがとうございます",
        romaji: "Arigatou gozaimasu",
        pronunciation: "ah-ree-gah-toh goh-zai-mass",
        english: "Thank you (formal)",
        mnemonic: "Sounds like 'Alligator goes to mess.' Picture an alligator making a mess and then politely thanking you.",
        category: "Essentials"
    },
    {
        japanese: "すみません",
        romaji: "Sumimasen",
        pronunciation: "soo-mee-mah-sen",
        english: "Excuse me / I'm sorry",
        mnemonic: "'Sue me, my friend!' is something you'd say if you bumped into someone, like 'excuse me'.",
        category: "Essentials"
    },
    {
        japanese: "はい",
        romaji: "Hai",
        pronunciation: "hai",
        english: "Yes",
        mnemonic: "You say 'Hi' to agree with someone.",
        category: "Essentials"
    },
    {
        japanese: "いいえ",
        romaji: "Iie",
        pronunciation: "ee-eh",
        english: "No",
        mnemonic: "Sounds like you're saying the letter 'E-A', as in 'EA sports... it's not in the game'. 'No'.",
        category: "Essentials"
    },
     {
        japanese: "お願いします",
        romaji: "Onegaishimasu",
        pronunciation: "oh-neh-guy-shee-mass",
        english: "Please (when requesting)",
        mnemonic: "Imagine saying 'Oh nice mouse!' when asking to borrow someone's computer mouse.",
        category: "Essentials"
    },
    {
        japanese: "ごめんなさい",
        romaji: "Gomen nasai",
        pronunciation: "goh-men nah-sai",
        english: "I'm sorry (more apologetic)",
        mnemonic: "'Go men, now sigh' because you've made a mistake.",
        category: "Essentials"
    },
    {
        japanese: "わかりません",
        romaji: "Wakarimasen",
        pronunciation: "wah-kah-ree-mah-sen",
        english: "I don't understand",
        mnemonic: "Imagine trying to drive a 'Wacky car' but you 'mess up' because you don't understand it.",
        category: "Essentials"
    },
    {
        japanese: "日本語が話せません",
        romaji: "Nihongo ga hanasemasen",
        pronunciation: "nee-hon-go gah hah-nah-seh-mah-sen",
        english: "I can't speak Japanese",
        mnemonic: "'Nihongo? Go...' then you 'can't say' more.",
        category: "Essentials"
    },
    {
        japanese: "大丈夫です",
        romaji: "Daijoubu desu",
        pronunciation: "dai-joh-boo dess",
        english: "It's okay / I'm okay",
        mnemonic: "It's okay to wear a 'Die Job' uniform.",
        category: "Essentials"
    },
    {
        japanese: "すごい",
        romaji: "Sugoi",
        pronunciation: "soo-goy",
        english: "Wow / Amazing",
        mnemonic: "'So goy!' you exclaim, that's amazing!",
        category: "Essentials"
    },

    // Shopping (6)
    {
        japanese: "いくらですか",
        romaji: "Ikura desu ka?",
        pronunciation: "ee-koo-rah dess kah",
        english: "How much is it?",
        mnemonic: "Imagine asking 'Is Ikura (salmon roe) this much?' when you see the price.",
        category: "Shopping"
    },
    {
        japanese: "これは何ですか",
        romaji: "Kore wa nan desu ka?",
        pronunciation: "koh-reh wah nahn dess kah",
        english: "What is this?",
        mnemonic: "'Core what none desk car?'. Imagine pointing at strange things on a desk asking what they are.",
        category: "Shopping"
    },
     {
        japanese: "クレジットカードは使えますか",
        romaji: "Kurejitto kādo wa tsukaemasu ka?",
        pronunciation: "koo-reh-jit-toh kah-doh wah tska-eh-mass-kah",
        english: "Can I use a credit card?",
        mnemonic: "It sounds a lot like 'Credit card what sky mouse car?' - a weird image to help you remember!",
        category: "Shopping"
    },
    {
        japanese: "これをください",
        romaji: "Kore o kudasai",
        pronunciation: "koh-reh oh koo-dah-sai",
        english: "I'll take this, please",
        mnemonic: "'Core, oh, could I see?' - then you decide you want it.",
        category: "Shopping"
    },
    {
        japanese: "試着できますか",
        romaji: "Shichaku dekimasu ka?",
        pronunciation: "shee-cha-koo deh-kee-mass kah",
        english: "Can I try it on?",
        mnemonic: "'She check?' You ask if she can check if you can try it on.",
        category: "Shopping"
    },
    {
        japanese: "袋をください",
        romaji: "Fukuro o kudasai",
        pronunciation: "foo-koo-roh oh koo-dah-sai",
        english: "A bag, please",
        mnemonic: "You need a bag for your 'four crows'.",
        category: "Shopping"
    },

    // Directions (7)
    {
        japanese: "トイレはどこですか",
        romaji: "Toire wa doko desu ka?",
        pronunciation: "toy-reh wah doh-koh dess kah",
        english: "Where is the toilet?",
        mnemonic: "'Toilet what dock desk car?' A strange question, but it helps you remember the phrase for finding a toilet.",
        category: "Directions"
    },
    {
        japanese: "駅はどこですか",
        romaji: "Eki wa doko desu ka?",
        pronunciation: "eh-kee wah doh-koh dess kah",
        english: "Where is the station?",
        mnemonic: "An 'echo' can be found 'where'? In a big station!",
        category: "Directions"
    },
     {
        japanese: "まっすぐ",
        romaji: "Massugu",
        pronunciation: "mah-soo-goo",
        english: "Straight ahead",
        mnemonic: "'Massive goo' is straight ahead, don't step in it!",
        category: "Directions"
    },
    {
        japanese: "右",
        romaji: "Migi",
        pronunciation: "mee-gee",
        english: "Right",
        mnemonic: "'Me?' 'Gee!' you say as you turn right.",
        category: "Directions"
    },
    {
        japanese: "左",
        romaji: "Hidari",
        pronunciation: "hee-dah-ree",
        english: "Left",
        mnemonic: "You 'hide a ri'ng on your left hand.",
        category: "Directions"
    },
    {
        japanese: "ここ",
        romaji: "Koko",
        pronunciation: "koh-koh",
        english: "Here",
        mnemonic: "Drink 'cocoa' right 'here'.",
        category: "Directions"
    },
    {
        japanese: "助けて",
        romaji: "Tasukete",
        pronunciation: "tah-skay-tay",
        english: "Help!",
        mnemonic: "You need help getting a 'task at Tay'lor's shop.",
        category: "Directions"
    },

    // Food (7)
    {
        japanese: "おいしい",
        romaji: "Oishii",
        pronunciation: "oy-shee",
        english: "Delicious",
        mnemonic: "Eating an 'oyster' that is 'sheer' delight. 'Oishii'!",
        category: "Food"
    },
    {
        japanese: "水をください",
        romaji: "Mizu o kudasai",
        pronunciation: "mee-zoo oh koo-dah-sai",
        english: "Water, please",
        mnemonic: "My 'Mizu'-no shoes, could I get some water on them, 'please'?",
        category: "Food"
    },
     {
        japanese: "メニューをください",
        romaji: "Menyū o kudasai",
        pronunciation: "meh-nyoo oh koo-dah-sai",
        english: "Menu, please",
        mnemonic: "It sounds like 'Menu oh could I see?' - which is exactly what you're asking!",
        category: "Food"
    },
    {
        japanese: "お会計お願いします",
        romaji: "Okaikei onegaishimasu",
        pronunciation: "oh-kai-kay oh-neh-guy-she-mass",
        english: "The bill, please",
        mnemonic: "Think 'Oh, okay K, onegaishimasu' when you're ready to pay.",
        category: "Food"
    },
    {
        japanese: "いただきます",
        romaji: "Itadakimasu",
        pronunciation: "ee-tah-dah-kee-mass",
        english: "Let's eat / I receive this meal",
        mnemonic: "I 'eat a ducky' for this meal.",
        category: "Food"
    },
    {
        japanese: "ごちそうさまでした",
        romaji: "Gochisousama deshita",
        pronunciation: "goh-chee-soh-sah-mah desh-tah",
        english: "Thank you for the meal (after eating)",
        mnemonic: "'Go cheese so summer' after a delicious meal.",
        category: "Food"
    },
    {
        japanese: "乾杯",
        romaji: "Kanpai",
        pronunciation: "kahn-pai",
        english: "Cheers!",
        mnemonic: "You 'can pie' someone after a toast.",
        category: "Food"
    },

    // Numbers (10)
    { japanese: "一", romaji: "Ichi", pronunciation: "ee-chee", english: "One", mnemonic: "An 'itchy' number one.", category: "Numbers" },
    { japanese: "二", romaji: "Ni", pronunciation: "nee", english: "Two", mnemonic: "Two 'knee's.", category: "Numbers" },
    { japanese: "三", romaji: "San", pronunciation: "sahn", english: "Three", mnemonic: "Three rays of 'sun'.", category: "Numbers" },
    { japanese: "四", romaji: "Yon / Shi", pronunciation: "yohn / shee", english: "Four", mnemonic: "'Yawn' four times.", category: "Numbers" },
    { japanese: "五", romaji: "Go", pronunciation: "goh", english: "Five", mnemonic: "'Go' for five!", category: "Numbers" },
    { japanese: "六", romaji: "Roku", pronunciation: "roh-koo", english: "Six", mnemonic: "Six 'rocks'.", category: "Numbers" },
    { japanese: "七", romaji: "Nana / Shichi", pronunciation: "nah-nah / shee-chee", english: "Seven", mnemonic: "My 'nana' is seven.", category: "Numbers" },
    { japanese: "八", romaji: "Hachi", pronunciation: "hah-chee", english: "Eight", mnemonic: "A bee 'hatching' from eight eggs.", category: "Numbers" },
    { japanese: "九", romaji: "Kyuu / Ku", pronunciation: "kyoo", english: "Nine", mnemonic: "A 'cue' stick is nine feet long.", category: "Numbers" },
    { japanese: "十", romaji: "Juu", pronunciation: "joo", english: "Ten", mnemonic: "Ten pieces of 'jew'elry.", category: "Numbers" }
];

// --- Helper Components ---

const SvgIcon = ({ d, className = "w-6 h-6" }: { d: string, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
);

const NavButton = ({ children, onClick, active }: { children: React.ReactNode, onClick: () => void, active: boolean }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center gap-2 px-4 py-3 font-semibold transition-all duration-300 rounded-lg ${
            active
                ? 'bg-red-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-red-100 hover:shadow-md'
        }`}
    >
        {children}
    </button>
);

// --- Modal Component for Adding Words ---
const AddWordModal = ({ onAddWord, onClose }: { onAddWord: (word: Word) => void, onClose: () => void }) => {
    const [formData, setFormData] = useState({
        japanese: '',
        romaji: '',
        pronunciation: '',
        english: '',
        mnemonic: '',
        category: 'Custom'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.japanese || !formData.romaji || !formData.english) {
            console.error('Please fill in at least the Japanese, Romaji, and English fields.');
            return;
        }
        onAddWord(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
                    <SvgIcon d="M6 18L18 6M6 6l12 12" className="w-7 h-7" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Add a New Word</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="japanese" value={formData.japanese} onChange={handleChange} placeholder="Japanese (e.g., 猫)" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" />
                    <input type="text" name="romaji" value={formData.romaji} onChange={handleChange} placeholder="Romaji (e.g., Neko)" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" />
                    <input type="text" name="pronunciation" value={formData.pronunciation} onChange={handleChange} placeholder="Pronunciation (e.g., neh-koh)" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" />
                    <input type="text" name="english" value={formData.english} onChange={handleChange} placeholder="English (e.g., Cat)" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" />
                    <textarea name="mnemonic" value={formData.mnemonic} onChange={handleChange} placeholder="Mnemonic (e.g., Your neck is full of cats)" rows={3} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"></textarea>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600">Add Word</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Main Components ---

const StudyBar = ({ count, onStartStudy }: { count: number, onStartStudy: (page: string) => void }) => {
    if (count === 0) return null;
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl z-20 p-4 transform transition-transform duration-300 translate-y-0">
            <div className="container mx-auto flex justify-between items-center">
                <p className="text-lg font-semibold text-gray-700">
                    <span className="bg-red-500 text-white rounded-full px-3 py-1 mr-2">{count}</span>
                    {count === 1 ? 'word selected' : 'words selected'}
                </p>
                <div className="flex gap-4">
                    <button onClick={() => onStartStudy('flashcards')} className="flex items-center gap-2 px-5 py-2 font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200">
                        <SvgIcon d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6" />
                        Flashcards
                    </button>
                    <button onClick={() => onStartStudy('quiz')} className="flex items-center gap-2 px-5 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600">
                        <SvgIcon d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        Quiz
                    </button>
                </div>
            </div>
        </div>
    );
};

const WordListPage = ({ words, selectedWords, onWordSelect }: { words: Word[], selectedWords: string[], onWordSelect: (japaneseWord: string) => void }) => {
    return (
        <div className="space-y-4 pb-24">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Tourist Phrasebook</h2>
                    <p className="text-gray-600">Select words to start a study session.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {words.map((word) => {
                    const isSelected = selectedWords.includes(word.japanese);
                    return (
                        <div
                            key={word.japanese}
                            onClick={() => onWordSelect(word.japanese)}
                            className={`p-5 bg-white rounded-xl shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden ${isSelected ? 'ring-2 ring-red-500 scale-105' : 'hover:shadow-xl hover:-translate-y-1'}`}
                        >
                            <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? 'bg-red-500 border-red-500' : 'border-gray-300'}`}>
                                {isSelected && <SvgIcon d="M4.5 12.75l6 6 9-13.5" className="w-4 h-4 text-white" />}
                            </div>
                            <p className="text-2xl font-semibold text-red-500">{word.japanese}</p>
                            <p className="text-lg text-gray-700">{word.romaji}</p>
                            <p className="text-md text-gray-500 italic">{word.pronunciation}</p>
                            <p className="mt-2 text-lg font-medium text-gray-800">{word.english}</p>
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-sm text-gray-600"><span className="font-bold">Mnemonic:</span> {word.mnemonic}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const FlashcardPage = ({ words, onExitStudy }: { words: Word[], onExitStudy: (() => void) | null }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        setCurrentIndex(0);
        setIsFlipped(false);
    }, [words]);

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 150);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + words.length) % words.length);
        }, 150);
    };
    
    if (!words || words.length === 0) {
        return <div className="text-center text-gray-600">No words in this study session. Go back to the list to select some!</div>;
    }
    
    const currentWord = words[currentIndex];

    return (
        <div className="flex flex-col items-center justify-center">
             {onExitStudy && (
                <button onClick={onExitStudy} className="mb-6 text-red-500 font-semibold hover:underline">
                    &larr; Back to full word list
                </button>
            )}
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Flashcards</h2>
             <div className="w-full max-w-md h-80 perspective-1000">
                <div
                    className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    {/* Front of the card */}
                    <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-white rounded-2xl shadow-xl cursor-pointer p-6">
                        <p className="text-4xl font-bold text-gray-800 text-center">{currentWord.english}</p>
                    </div>

                    {/* Back of the card */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-red-500 text-white rounded-2xl shadow-xl cursor-pointer p-6 flex flex-col justify-center items-center text-center">
                        <p className="text-4xl font-bold mb-2">{currentWord.japanese}</p>
                        <p className="text-2xl font-semibold">{currentWord.romaji}</p>
                        <p className="italic mb-4">({currentWord.pronunciation})</p>
                        <p className="text-sm bg-red-400 p-3 rounded-lg">{currentWord.mnemonic}</p>
                    </div>
                </div>
            </div>
            <div className="mt-8 text-center text-gray-600">
                Card {currentIndex + 1} of {words.length}
            </div>
            <div className="flex gap-4 mt-4">
                <button onClick={handlePrev} className="px-6 py-3 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors">Previous</button>
                <button onClick={handleNext} className="px-6 py-3 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors">Next</button>
            </div>
        </div>
    );
};


const QuizPage = ({ words, allWords, onExitStudy }: { words: Word[], allWords: Word[], onExitStudy: (() => void) | null }) => {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);

    const generateQuestions = useCallback(() => {
        if (!words || words.length === 0) {
            setQuestions([]);
            return;
        }
        
        if (allWords.length < 4 && words.length > 1) {
             console.warn("Not enough words for a full quiz, some answers may repeat.");
        }

        const shuffledStudyWords = [...words].sort(() => 0.5 - Math.random());
        
        const quizQuestions = shuffledStudyWords.map(correctWord => {
            const incorrectOptions: Word[] = [...allWords]
                .filter(word => word.japanese !== correctWord.japanese)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);
            
            const options = [correctWord, ...incorrectOptions].sort(() => 0.5 - Math.random());
            
            return {
                question: correctWord.english,
                options: options,
                answer: correctWord.japanese,
                mnemonic: correctWord.mnemonic
            };
        });
        setQuestions(quizQuestions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setQuizFinished(false);
    }, [words, allWords]);

    useEffect(() => {
        generateQuestions();
    }, [generateQuestions]);

    const handleAnswer = (option: Word) => {
        if (isAnswered) return;
        
        setSelectedAnswer(option.japanese);
        setIsAnswered(true);

        if (option.japanese === questions[currentQuestionIndex].answer) {
            setScore(score + 1);
        }
    };

    const handleNextQuestion = () => {
        setIsAnswered(false);
        setSelectedAnswer(null);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setQuizFinished(true);
        }
    };
    
    const restartQuiz = () => {
        generateQuestions();
    }
    
    if (allWords.length < 4) {
        return <div className="text-center text-gray-600">You need at least 4 words in your total list to start a quiz.</div>;
    }
    
    if (!words || words.length === 0) {
         return <div className="text-center text-gray-600">No words in this study session. Go back to the list to select some!</div>;
    }


    if (quizFinished) {
        return (
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
                 {onExitStudy && (
                    <button onClick={onExitStudy} className="mb-6 text-red-500 font-semibold hover:underline">
                        &larr; Back to full word list
                    </button>
                )}
                <h2 className="text-4xl font-bold text-gray-800">Quiz Complete!</h2>
                <p className="text-2xl mt-4 text-gray-600">Your score: <span className="font-bold text-red-500">{score} / {questions.length}</span></p>
                <button onClick={restartQuiz} className="mt-8 px-8 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors">
                    Try Again
                </button>
            </div>
        );
    }

    if (questions.length === 0) {
        return <div>Loading quiz...</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="w-full max-w-2xl mx-auto">
            {onExitStudy && (
                <button onClick={onExitStudy} className="mb-6 text-red-500 font-semibold hover:underline">
                    &larr; Back to full word list
                </button>
            )}
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Quiz Time!</h2>
            <p className="text-center text-gray-500 mb-6">Question {currentQuestionIndex + 1} of {questions.length}</p>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center mb-8 min-h-[100px] flex flex-col justify-center">
                    <p className="text-4xl font-bold text-gray-800">{currentQuestion.question}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option: Word, index: number) => {
                        const isCorrect = option.japanese === currentQuestion.answer;
                        let buttonClass = 'bg-white text-gray-800 hover:bg-red-100 border border-gray-300';
                        
                        if (isAnswered) {
                            if (isCorrect) {
                                buttonClass = 'bg-green-500 text-white border-green-500';
                            } else if (selectedAnswer === option.japanese) {
                                buttonClass = 'bg-red-500 text-white border-red-500';
                            } else {
                                 buttonClass = 'bg-gray-200 text-gray-500 border-gray-200 opacity-70';
                            }
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option)}
                                disabled={isAnswered}
                                className={`p-4 rounded-lg font-semibold text-left transition-all duration-300 flex flex-col justify-center min-h-[8rem] ${buttonClass}`}
                            >
                                {!isAnswered ? (
                                    <span className="block text-2xl">{option.romaji}</span>
                                ) : (
                                    <>
                                        <span className="block text-2xl">{option.japanese}</span>
                                        <span className="block text-md text-gray-400 italic">{option.romaji}</span>
                                        <span className="block text-sm text-gray-500">({option.pronunciation})</span>
                                        <span className="block text-base mt-1">{option.english}</span>
                                    </>
                                )}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                     <div className="mt-6 text-center">
                        <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg">
                           <p className="text-yellow-800"><span className="font-bold">Mnemonic:</span> {currentQuestion.mnemonic}</p>
                        </div>
                        <button 
                            onClick={handleNextQuestion} 
                            className="mt-6 px-8 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors"
                        >
                            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- App ---

export default function App() {
    const [activePage, setActivePage] = useState('home');
    const [words, setWords] = useState(initialJapaneseWords);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [studyList, setStudyList] = useState<Word[] | null>(null);

    const handleWordSelect = (japaneseWord: string) => {
        setSelectedWords(prevSelected => {
            if (prevSelected.includes(japaneseWord)) {
                return prevSelected.filter(w => w !== japaneseWord);
            } else {
                return [...prevSelected, japaneseWord];
            }
        });
    };

    const handleStartStudy = (page: string) => {
        const newStudyList = words.filter(word => selectedWords.includes(word.japanese));
        setStudyList(newStudyList);
        setActivePage(page);
        setSelectedWords([]);
    };
    
    const handleExitStudy = () => {
        setStudyList(null);
        setActivePage('home');
    };

    const handleNavigation = (page: string) => {
        if (page === 'home') {
            setStudyList(null); 
        } else if (studyList === null) {
            // If we are not in study mode and navigate, stay out of study mode
            setStudyList(null);
        }
        // If we are in study mode and navigate between flashcards/quiz, keep the study list
        setActivePage(page);
    };

    const handleAddWord = (newWord: Word) => {
        setWords(prevWords => [newWord, ...prevWords]);
    };

    const handleAddWordAndCloseModal = (newWord: Word) => {
        handleAddWord(newWord);
        setIsModalOpen(false);
    };

    const renderPage = () => {
        const isStudying = studyList !== null;
        const wordsForComponent = isStudying ? studyList : words;

        switch (activePage) {
            case 'home':
                return <WordListPage words={words} selectedWords={selectedWords} onWordSelect={handleWordSelect} />;
            case 'flashcards':
                return <FlashcardPage words={wordsForComponent} onExitStudy={isStudying ? handleExitStudy : null} />;
            case 'quiz':
                return <QuizPage words={wordsForComponent} allWords={words} onExitStudy={isStudying ? handleExitStudy : null} />;
            default:
                return <WordListPage words={words} selectedWords={selectedWords} onWordSelect={handleWordSelect} />;
        }
    };
    
    return (
        <>
            {isModalOpen && <AddWordModal onAddWord={handleAddWordAndCloseModal} onClose={() => setIsModalOpen(false)} />}
        
            <style>{`
              .perspective-1000 { perspective: 1000px; }
              .transform-style-preserve-3d { transform-style: preserve-3d; }
              .rotate-y-180 { transform: rotateY(180deg); }
              .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
            `}</style>
        
            <div className="min-h-screen bg-gray-50 font-sans">
                <header className="bg-white shadow-sm sticky top-0 z-10">
                    <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
                        <div className="flex items-center gap-3 mb-4 sm:mb-0">
                             <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                日
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">Nihongo Navigator</h1>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <nav className="flex gap-2 sm:gap-4 bg-gray-100 p-2 rounded-xl">
                                <NavButton onClick={() => handleNavigation('home')} active={activePage === 'home'}>
                                    <SvgIcon d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                                    Words
                                </NavButton>
                                <NavButton onClick={() => handleNavigation('flashcards')} active={activePage === 'flashcards'}>
                                    <SvgIcon d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6" />
                                    Flashcards
                                </NavButton>
                                <NavButton onClick={() => handleNavigation('quiz')} active={activePage === 'quiz'}>
                                    <SvgIcon d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                                    Quiz
                                </NavButton>
                            </nav>
                             <button 
                                onClick={() => setIsModalOpen(true)} 
                                className="flex items-center justify-center gap-2 px-4 py-3 font-semibold transition-all duration-300 rounded-lg bg-red-100 text-red-600 hover:bg-red-500 hover:text-white hover:shadow-md"
                                title="Add a new word"
                            >
                                <SvgIcon d="M12 4.5v15m7.5-7.5h-15" />
                                <span className="hidden sm:inline">Add Word</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto p-4 sm:p-8">
                    {renderPage()}
                </main>
                
                {activePage === 'home' && <StudyBar count={selectedWords.length} onStartStudy={handleStartStudy} />}

                <footer className="bg-white mt-12 py-6">
                    <div className="container mx-auto px-4 text-center text-gray-500">
                        <p>&copy; {new Date().getFullYear()} Nihongo Navigator. Happy learning!</p>
                        <p className="text-sm mt-1">Made with ❤️ for Japanese language enthusiasts.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}

