/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Shell from './components/layout/Shell.tsx';
import ChatInterface from './components/chat/ChatInterface.tsx';
import SummaryView from './components/study/SummaryView.tsx';
import QuizView from './components/study/QuizView.tsx';
import FlashcardView from './components/study/FlashcardView.tsx';
import MeteorologyView from './components/study/MeteorologyView.tsx';
import FlightBriefingView from './components/operational/FlightBriefingView.tsx';
import LibraryView from './components/study/LibraryView.tsx';
import PlanningTools from './components/tools/PlanningTools.tsx';
import LogbookView from './components/pilot/LogbookView.tsx';
import StudentCard from './components/pilot/StudentCard.tsx';
import SubscriptionModal from './components/subscription/SubscriptionModal.tsx';
import AuthModal from './components/auth/AuthModal.tsx';
import { StudyTab, StudyMaterial, Scenario, DGCASubject, UserProfile } from './types.ts';
import { generateSummary, generateQuiz, generateBrainHacks, generateScenario } from './services/geminiService.ts';
import { authService } from './services/authService.ts';
import { userService } from './services/userService.ts';

export default function App() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<StudyTab>('chat');
  const [currentSubject, setCurrentSubject] = useState<DGCASubject>('general');
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [currentMaterialIndex, setCurrentMaterialIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubOpen, setIsSubOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthChanges(async (currUser) => {
      setUserProfile(currUser);
      setIsAuthOpen(!currUser);
      setIsInitialized(true);
    });
    return () => unsubscribe();
  }, []);

  const currentMaterial = currentMaterialIndex >= 0 ? materials[currentMaterialIndex] : null;

  const handleProcessMaterial = async (text: string) => {
    if (!userProfile) {
      setIsAuthOpen(true);
      return;
    }
    setIsLoading(true);
    setActiveTab('summary');
    
    try {
      const materialId = Date.now().toString();
      const contextualText = `[SUBJECT: ${currentSubject.toUpperCase()}] ${text}`;
      
      const [summary, quiz, hacks] = await Promise.all([
        generateSummary(contextualText),
        generateQuiz(contextualText),
        generateBrainHacks(contextualText)
      ]);

      const newMaterial: StudyMaterial = {
        id: materialId,
        title: text.slice(0, 30) + (text.length > 30 ? '...' : ''),
        content: text,
        summary,
        quiz,
        hacks,
        timestamp: Date.now()
      };

      setMaterials(prev => [newMaterial, ...prev]);
      setCurrentMaterialIndex(0);

      // Save to history in background
      userService.saveSession(userProfile.uid, {
        subject: currentSubject,
        chapter: newMaterial.title,
        score: 0,
        totalQuestions: quiz.length
      });
    } catch (error) {
      console.error("Failed to process material:", error);
      alert("Oops! AirclassPRO hit a snag. Let's try that again.");
      setActiveTab('chat');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface onProcess={handleProcessMaterial} isLoading={isLoading} currentSubject={currentSubject} />;
      case 'summary':
        return (
          <SummaryView 
            summary={currentMaterial?.summary} 
            isLoading={isLoading} 
            history={materials}
            onSelectHistory={(index) => {
              setCurrentMaterialIndex(index);
              setActiveTab('summary');
            }}
          />
        );
      case 'quiz':
        return (
          <QuizView 
            questions={currentMaterial?.quiz} 
            isLoading={isLoading} 
            onReset={() => {}} 
            currentSubject={currentSubject}
            profile={userProfile}
          />
        );

      case 'flashcards':
        return <FlashcardView summary={currentMaterial?.summary} history={materials} isLoading={isLoading} />;
      case 'meteorology':
        return <MeteorologyView />;
      case 'briefing':
        return <FlightBriefingView profile={userProfile} />;
      case 'planning':
        return <PlanningTools />;
      case 'logbook':
        return <LogbookView profile={userProfile} onUpdateProfile={(data) => {
          userService.updateProfile(data).then(updated => {
            if (updated) setUserProfile(updated);
          });
        }} />;
      case 'library':
        return <LibraryView />;
      case 'id-card':
        return userProfile ? <StudentCard profile={userProfile} /> : <ChatInterface onProcess={handleProcessMaterial} isLoading={isLoading} currentSubject={currentSubject} />;
      default:
        return <ChatInterface onProcess={handleProcessMaterial} isLoading={isLoading} currentSubject={currentSubject} />;
    }
  };

  return (
    <Shell 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      currentSubject={currentSubject}
      setCurrentSubject={setCurrentSubject}
      onOpenSubscription={() => setIsSubOpen(true)}
      userData={userProfile}
    >
      {renderContent()}
      <SubscriptionModal 
        isOpen={isSubOpen} 
        onClose={() => setIsSubOpen(false)} 
        userEmail={userProfile?.email}
      />
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => {
          if (userProfile) setIsAuthOpen(false);
        }} 
        onSuccess={() => setIsAuthOpen(false)} 
      />
    </Shell>
  );
}

