/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { 
  CloudRain, 
  Cloud,
  Cpu, 
  Satellite, 
  Wifi, 
  AlertTriangle, 
  AlertCircle,
  TrendingUp, 
  ChevronRight, 
  Info,
  Waves,
  Zap,
  ShieldCheck,
  Activity,
  Globe,
  Bot,
  MessageSquare,
  X,
  Search,
  Home,
  List
} from 'lucide-react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  Sector
} from 'recharts';
import { GoogleGenAI, Modality } from "@google/genai";

// --- Types ---
type Language = 'en' | 'fr' | 'ar';
type Theme = 'dark' | 'light';

interface Translation {
  hero: {
    title: string;
    subtitle: string;
  };
  generalIdea: {
    title: string;
    content: string;
    browse: string;
  };
  detailedExplanation: {
    title: string;
    content: string;
    sections: {
      title: string;
      content: string;
      items?: {
        title: string;
        content?: string;
      }[];
    }[];
    browse: string;
    nextPage: string;
    prevPage: string;
  };
  pageTwo: {
    title: string;
    content: string;
    sections: {
      title: string;
      content: string;
      icon: string;
    }[];
    nextPage: string;
    prevPage: string;
    chart: {
      ai: string;
      iot: string;
      others: string;
      cloud: string;
      robotics: string;
    };
  };
  pageThree: {
    title: string;
    content: string;
    sections: {
      title: string;
      content: string;
      moreInfo?: string;
      icon: string;
    }[];
    nextPage: string;
    prevPage: string;
  };
  pageFour: {
    title: string;
    content: string;
    sections: {
      title: string;
      content: string;
      icon: string;
    }[];
    nextPage: string;
    prevPage: string;
  };
  pageFive: {
    title: string;
    content: string;
    videoTitle: string;
    prevPage: string;
    nextPage: string;
  };
  pageSix: {
    title: string;
    content: string;
    xAxis: string;
    yAxis: string;
    mapTitle: string;
    mapLegend: string;
    frequencyTitle: string;
    frequencyLabel: string;
    nextPage: string;
    prevPage: string;
  };
  pageSeven: {
    title: string;
    whatWeKnowTitle: string;
    whatWeKnowContent: string;
    whatRemainsTitle: string;
    whatRemainsContent: string;
    prevPage: string;
    nextPage: string;
  };
  pageEight: {
    title: string;
    thankYou: string;
    message: string;
    presentedBy: string;
    names: string;
    prevPage: string;
  };
  robot: {
    welcome: string;
    chatTitle: string;
    placeholder: string;
    send: string;
    thinking: string;
  };
}

const translations: Record<Language, Translation> = {
  en: {
    hero: {
      title: 'A Critical Review of Emerging Technologies for Flash Flood Prediction',
      subtitle: 'Examining Artificial Intelligence, Machine Learning, Internet of Things, Cloud Computing, and Robotics Techniques'
    },
    generalIdea: {
      title: 'General Idea',
      content: 'Flash floods are rapid, high-intensity natural disasters. Modern prediction systems integrate AI, IoT, and Cloud Computing to provide early warnings, aiming to minimize loss of life and infrastructure damage through real-time monitoring and advanced modeling.',
      browse: 'Browse'
    },
    detailedExplanation: {
      title: 'Detailed Explanation',
      content: 'The prediction framework relies on a multi-layered technological approach:',
      sections: [
        {
          title: 'Importance of this Research',
          content: 'This research addresses the critical need for advanced flash flood prediction:',
          items: [
            {
              title: 'Significant impact on humans and infrastructure.',
              content: 'Flash floods are climate-driven disasters with large socioeconomic, health, and mental-health impacts.'
            },
            {
              title: 'Limitations and problems in traditional prediction methods.',
              content: 'Traditional models are often inaccurate, time-consuming, require massive amounts of data, and do not perform efficiently across all domains.'
            },
            {
              title: 'The primary goal and objective of this research.',
              content: 'Critically review the trends, performance, indicators, strengths, and limitations of AI/ML, IoT, Cloud Computing, and Robotics for flash flood prediction.'
            }
          ]
        },
        {
          title: 'How Studies were Selected',
          content: 'Studies were selected based on their relevance to emerging technologies, citation impact, and practical application in flood-prone regions.',
          items: [
            {
              title: 'Methodology and Data Sources',
              content: 'Regarding the methodology, a review of a group of scientific studies published between 2010 and 2023 was used, using scientific databases such as Google Scholar and Scopus.'
            }
          ]
        }
      ],
      browse: 'Browse',
      nextPage: 'Go to Page 2',
      prevPage: 'Back to Page 1'
    },
    pageTwo: {
      title: 'Technological Integration Analysis',
      content: 'The integration of these emerging technologies creates a robust ecosystem for real-time monitoring and predictive modeling.',
      sections: [
        {
          title: 'AI & Machine Learning',
          content: 'Used for pattern recognition and historical data analysis to predict future flood events with high accuracy.',
          icon: 'cpu'
        },
        {
          title: 'Internet of Things (IoT)',
          content: 'Sensors deployed in river basins provide real-time water level and precipitation data.',
          icon: 'wifi'
        },
        {
          title: 'Cloud Computing',
          content: 'Provides the necessary computational power and storage to process massive datasets instantly.',
          icon: 'cloud'
        },
        {
          title: 'Robotics & Drones',
          content: 'Used for post-flood assessment and monitoring hard-to-reach areas during events.',
          icon: 'bot'
        }
      ],
      nextPage: 'Go to Page 3',
      prevPage: 'Back to Page 1',
      chart: {
        ai: 'Artificial Intelligence / Machine Learning',
        iot: 'Internet of Things',
        others: 'Others',
        cloud: 'Cloud Computing',
        robotics: 'Robotics'
      }
    },
    pageThree: {
      title: 'Conclusion and Future Directions',
      content: 'The integration of AI, IoT, and Cloud Computing is essential for modern flood prediction. Future research should focus on improving data accuracy and reducing system latency.',
      sections: [
        {
          title: 'Challenges',
          content: 'Data quality, high implementation costs, and infrastructure reliability remain significant hurdles. Click for more info.',
          moreInfo: 'Key challenges include data quality, as inaccurate data can lead to false predictions. High implementation costs for IoT and Cloud infrastructure also pose barriers for developing nations. Furthermore, infrastructure reliability in extreme weather conditions remains a significant technical hurdle.',
          icon: 'alert'
        },
        {
          title: 'Opportunities',
          content: 'Real-time global monitoring and community-based early warning systems offer promising paths forward. Click for more info.',
          moreInfo: 'Advancements in satellite technology and low-power wide-area networks (LPWAN) provide new opportunities for global monitoring. Community-based systems integrated with mobile apps can significantly reduce response times and save lives.',
          icon: 'zap'
        }
      ],
      prevPage: 'Back to Page 2',
      nextPage: 'Go to Page 4'
    },
    pageFour: {
      title: 'Strengths, Limitations, and Initial Actions',
      content: 'A summary of the key findings regarding the effectiveness of emerging technologies in flood prediction.',
      sections: [
        {
          title: 'Findings',
          content: 'High predictive accuracy, real-time monitoring capabilities, and automated early warning systems.',
          icon: 'trending-up'
        },
        {
          title: 'Limitations',
          content: 'Dependence on data quality, high initial costs, and technical complexity in integration.',
          icon: 'alert-triangle'
        },
        {
          title: 'Priority Actions',
          content: 'Standardizing data protocols, investing in resilient infrastructure, and enhancing community training.',
          icon: 'activity'
        }
      ],
      nextPage: 'Go to Page 5',
      prevPage: 'Back to Page 3'
    },
    pageFive: {
      title: 'Video Demonstration',
      content: 'Watch this video to learn more about AI applications in disaster management.',
      videoTitle: 'YouTube Video Demonstration',
      prevPage: 'Back to Page 4',
      nextPage: 'Go to Page 6'
    },
    pageSix: {
      title: 'Research Evolution (2010-2023)',
      content: 'This chart illustrates the growth in the number of scientific articles published annually on flash flood prediction using emerging technologies.',
      xAxis: 'Year',
      yAxis: 'Number of Articles',
      mapTitle: 'Global Research Distribution',
      mapLegend: 'Number of Publications by Country',
      frequencyTitle: 'Research Frequency by Country',
      frequencyLabel: 'Frequency',
      nextPage: 'Go to Conclusion',
      prevPage: 'Back to Page 5'
    },
    pageSeven: {
      title: 'Conclusion & Future Outlook',
      whatWeKnowTitle: 'What we know',
      whatWeKnowContent: 'AI/ML, IoT, and cloud computing can accurately predict flash-flood-prone areas and issue near real-time warnings; RF and SVM are widely used and effective in many cases.',
      whatRemainsTitle: 'What remains',
      whatRemainsContent: 'Models need optimization, theoretical justification for variable choice, better test datasets, resilience to connectivity loss, and evaluation using observed health/property outcomes.',
      prevPage: 'Back to Page 6',
      nextPage: 'Finish'
    },
    pageEight: {
      title: 'The End',
      thankYou: 'Thank You',
      message: 'For your attention and listening, we hope you understood the topic.',
      presentedBy: 'Presented by',
      names: 'Ostmane Abdelkader Radouane & Sedjerari Houssem Eddine',
      prevPage: 'Back to Conclusion'
    },
    robot: {
      welcome: 'Welcome! I am your AI assistant. How can I help you today?',
      chatTitle: 'AI Assistant Chat',
      placeholder: 'Type your message...',
      send: 'Send',
      thinking: 'Thinking...'
    }
  },
  fr: {
    hero: {
      title: 'Une Revue Critique des Technologies Émergentes pour la Prédiction des Crues Éclairs',
      subtitle: 'Examen de l\'intelligence artificielle, de l\'apprentissage automatique, de l\'Internet des objets, de l\'informatique en nuage et des techniques de robotique'
    },
    generalIdea: {
      title: 'Idée Générale',
      content: 'Les crues éclair sont des catastrophes naturelles rapides et intenses. Les systèmes de prédiction modernes intègrent l\'IA, l\'IdO et le Cloud Computing pour fournir des alertes précoces, visant à minimiser les pertes humaines et les dommages aux infrastructures.',
      browse: 'Parcourir'
    },
    detailedExplanation: {
      title: 'Explication Détaillée',
      content: 'Le cadre de prédiction repose sur une approche technologique multicouche :',
      sections: [
        {
          title: 'Importance de cette recherche',
          content: 'Cette recherche répond au besoin critique de prédiction avancée des crues éclair :',
          items: [
            {
              title: 'Impact significatif sur les humains et les infrastructures.',
              content: 'Les crues éclair sont des catastrophes climatiques ayant d\'importants impacts socio-économiques, sanitaires et sur la santé mentale.'
            },
            {
              title: 'Limites et problèmes des méthodes de prédiction traditionnelles.',
              content: 'Les modèles traditionnels sont souvent imprécis, chronophages, nécessitent d\'énormes quantités de données et ne fonctionnent pas efficacement dans tous les domaines.'
            },
            {
              title: 'Le but et l\'objectif principal de cette recherche.',
              content: 'Passer en revue de manière critique les tendances, les performances, les indicateurs, les points forts et les limites de l\'IA/ML, de l\'IdO, du Cloud Computing et de la robotique pour la prédiction des crues éclair.'
            }
          ]
        },
        {
          title: 'Comment les études ont été sélectionnées',
          content: 'Les études ont été sélectionnées en fonction de leur pertinence par rapport aux technologies émergentes, de leur impact sur les citations et de leur application pratique dans les régions sujettes aux inondations.',
          items: [
            {
              title: 'Méthodologie et sources de données',
              content: 'En ce qui concerne la méthodologie, une revue d\'un groupe d\'études scientifiques publiées entre 2010 et 2023 a été utilisée, à l\'aide de bases de données scientifiques telles que Google Scholar et Scopus.'
            }
          ]
        }
      ],
      browse: 'Parcourir',
      nextPage: 'Aller à la page 2',
      prevPage: 'Retour à la page 1'
    },
    pageTwo: {
      title: 'Analyse de l\'intégration technologique',
      content: 'L\'intégration de ces technologies émergentes crée un écosystème robuste pour la surveillance en temps réel et la modélisation prédictive.',
      sections: [
        {
          title: 'IA et Apprentissage Automatique',
          content: 'Utilisé pour la reconnaissance de formes et l\'analyse des données historiques afin de prédire les futurs événements d\'inondation avec une grande précision.',
          icon: 'cpu'
        },
        {
          title: 'Internet des Objets (IdO)',
          content: 'Des capteurs déployés dans les bassins fluviaux fournissent des données en temps réel sur le niveau de l\'eau et les précipitations.',
          icon: 'wifi'
        },
        {
          title: 'Informatique en Nuage',
          content: 'Fournit la puissance de calcul et le stockage nécessaires pour traiter instantanément des ensembles de données massifs.',
          icon: 'cloud'
        },
        {
          title: 'Robotique et Drones',
          content: 'Utilisés pour l\'évaluation après inondation et la surveillance des zones difficiles d\'accès pendant les événements.',
          icon: 'bot'
        }
      ],
      nextPage: 'Passer à la page 3',
      prevPage: 'Retour à la page 1',
      chart: {
        ai: 'Intelligence Artificielle / Apprentissage Automatique',
        iot: 'Internet des Objets',
        others: 'Autres',
        cloud: 'Cloud Computing',
        robotics: 'Robotique'
      }
    },
    pageThree: {
      title: 'Conclusion et orientations futures',
      content: "L'intégration de l'IA, de l'IdO et du Cloud Computing est essentielle pour la prédiction moderne des inondations. Les recherches futures devraient se concentrer sur l'amélioration de la précision des données et la réduction de la latence du système.",
      sections: [
        {
          title: 'Défis',
          content: "La qualité des données, les coûts de mise en œuvre élevés et la fiabilité des infrastructures restent des obstacles importants. Cliquez pour plus d'infos.",
          moreInfo: "Les principaux défis incluent la qualité des données, car des données inexactes peuvent conduire à de fausses prédictions. Les coûts de mise en œuvre élevés pour les infrastructures IdO et Cloud constituent également des obstacles pour les pays en développement. De plus, la fiabilité des infrastructures dans des conditions météorologiques extrêmes reste un défi technique majeur.",
          icon: 'alert'
        },
        {
          title: 'Opportunités',
          content: "La surveillance mondiale en temps réel et les systèmes d'alerte précoce communautaires offrent des pistes prometteuses. Cliquez pour plus d'infos.",
          moreInfo: "Les progrès de la technologie satellitaire et des réseaux à large zone et basse consommation (LPWAN) offrent de nouvelles opportunités pour la surveillance mondiale. Les systèmes communautaires intégrés aux applications mobiles peuvent réduire considérablement les temps de réponse et sauver des vies.",
          icon: 'zap'
        }
      ],
      prevPage: 'Retour à la page 2',
      nextPage: 'Aller à la page 4'
    },
    pageFour: {
      title: 'Forces, limites et actions initiales',
      content: 'Un résumé des principales conclusions concernant l\'efficacité des technologies émergentes dans la prédiction des inondations.',
      sections: [
        {
          title: 'Résultats',
          content: 'Haute précision prédictive, capacités de surveillance en temps réel et systèmes d\'alerte précoce automatisés.',
          icon: 'trending-up'
        },
        {
          title: 'Limites',
          content: 'Dépendance à la qualité des données, coûts initiaux élevés et complexité technique de l\'intégration.',
          icon: 'alert-triangle'
        },
        {
          title: 'Actions Prioritaires',
          content: 'Standardisation des protocoles de données, investissement dans des infrastructures résilientes et renforcement de la formation communautaire.',
          icon: 'activity'
        }
      ],
      nextPage: 'Passer à la page 5',
      prevPage: 'Retour à la page 3'
    },
    pageFive: {
      title: 'Démonstration Vidéo',
      content: 'Regardez cette vidéo pour en savoir plus sur les applications de l\'IA dans la gestion des catastrophes.',
      videoTitle: 'Démonstration Vidéo YouTube',
      prevPage: 'Retour à la page 4',
      nextPage: 'Aller à la page 6'
    },
    pageSix: {
      title: 'Évolution de la Recherche (2010-2023)',
      content: 'Ce graphique illustre la croissance du nombre d\'articles scientifiques publiés annuellement sur la prédiction des crues éclair à l\'aide de technologies émergentes.',
      xAxis: 'Année',
      yAxis: 'Nombre d\'Articles',
      mapTitle: 'Distribution Mondiale de la Recherche',
      mapLegend: 'Nombre de Publications par Pays',
      frequencyTitle: 'Fréquence de Recherche par Pays',
      frequencyLabel: 'Fréquence',
      nextPage: 'Aller à la Conclusion',
      prevPage: 'Retour à la page 5'
    },
    pageSeven: {
      title: 'Conclusion et Perspectives Futures',
      whatWeKnowTitle: 'Ce que nous savons',
      whatWeKnowContent: 'L\'IA/ML, l\'IoT et le cloud computing peuvent prédire avec précision les zones sujettes aux crues éclair et émettre des avertissements en temps quasi réel ; RF et SVM sont largement utilisés et efficaces dans de nombreux cas.',
      whatRemainsTitle: 'Ce qui reste',
      whatRemainsContent: 'Les modèles ont besoin d\'optimisation, d\'une justification théorique pour le choix des variables, de meilleurs ensembles de données de test, d\'une résilience à la perte de connectivité et d\'une évaluation utilisant les résultats observés en matière de santé/propriété.',
      prevPage: 'Retour à la page 6',
      nextPage: 'Terminer'
    },
    pageEight: {
      title: 'Fin',
      thankYou: 'Merci',
      message: 'Pour votre attention et votre écoute, nous espérons que vous avez compris le sujet.',
      presentedBy: 'Présenté par',
      names: 'Ostmane Abdelkader Radouane & Sedjerari Houssem Eddine',
      prevPage: 'Retour à la Conclusion'
    },
    robot: {
      welcome: 'Bienvenue ! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui ?',
      chatTitle: 'Chat de l\'assistant IA',
      placeholder: 'Écrivez votre message...',
      send: 'Envoyer',
      thinking: 'En train de réfléchir...'
    }
  },
  ar: {
    hero: {
      title: 'مراجعة نقدية للتقنيات الناشئة للتنبؤ بالفيضانات المفاجئة',
      subtitle: 'فحص الذكاء الاصطناعي، وتعلم الآلة، وإنترنت الأشياء، والحوسبة السحابية، وتقنيات الروبوتات'
    },
    generalIdea: {
      title: 'مقدمه',
      content: 'الفيضانات المفاجئة هي كوارث طبيعية سريعة وعالية الكثافة. تدمج أنظمة التنبؤ الحديثة الذكاء الاصطناعي وإنترنت الأشياء والحوسبة السحابية لتوفير إنذارات مبكرة، بهدف تقليل الخسائر في الأرواح والأضرار في البنية التحتية من خلال المراقبة في الوقت الفعلي والنمذجة المتقدمة.',
      browse: 'تصفح'
    },
    detailedExplanation: {
      title: 'شرح مفصل',
      content: 'يعتمد إطار التنبؤ على نهج تكنولوجي متعدد الطبقات:',
      sections: [
        {
          title: 'أهمية هذا البحث',
          content: 'يتناول هذا البحث الحاجة الماسة للتنبؤ المتقدم بالفيضانات المفاجئة:',
          items: [
            {
              title: 'التأثير الكبير على البشر والبنية التحتية.',
              content: 'الفيضانات المفاجئة هي كوارث مدفوعة بالمناخ ولها تأثيرات اجتماعية واقتصادية وصحية ونفسية كبيرة.'
            },
            {
              title: 'المشاكل والقيود في أساليب التنبؤ التقليدية.',
              content: 'ويرجع ذلك إلى أن النماذج القديمة غالباً ما تكون غير دقيقة، وتتطلب الكثير من الوقت وكميات هائلة من البيانات، ولا تعمل بكفاءة في جميع المجالات.'
            },
            {
              title: 'الهدف الأساسي والغاية من هذا البحث.',
              content: 'قم بمراجعة نقدية للاتجاهات والأداء والمؤشرات ونقاط القوة والقيود الخاصة بالذكاء الاصطناعي/التعلم الآلي وإنترنت الأشياء والحوسبة السحابية والروبوتات للتنبؤ بالفيضانات المفاجئة.'
            }
          ]
        },
        {
          title: 'كيفية اختيار الدراسات',
          content: 'تم اختيار الدراسات بناءً على صلتها بالتقنيات الناشئة، وتأثير الاستشهادات، والتطبيق العملي في المناطق المعرضة للفيضانات.',
          items: [
            {
              title: 'المنهجية ومصادر البيانات',
              content: 'فيما يتعلق بالمنهجية، تم استخدام مراجعة لمجموعة من الدراسات العلمية المنشورة بين عامي 2010 و 2023، باستخدام قواعد البيانات العلمية مثل Google Scholar و Scopus.'
            }
          ]
        }
      ],
      browse: 'تصفح',
      nextPage: 'الانتقال إلى الصفحة الثانية',
      prevPage: 'العودة إلى الصفحة الأولى'
    },
    pageTwo: {
      title: 'تحليل التكامل التكنولوجي',
      content: 'يخلق تكامل هذه التقنيات الناشئة نظاماً قوياً للمراقبة في الوقت الفعلي والنمذجة التنبؤية.',
      sections: [
        {
          title: 'الذكاء الاصطناعي وتعلم الآلة',
          content: 'يظهر الذكاء الاصطناعي/التعلم الآلي في 64% من الأبحاث التي تمت مراجعتها والمتعلقة بتقييم نقاط الضعف والإنذار المبكر',
          icon: 'cpu'
        },
        {
          title: 'إنترنت الأشياء (IoT)',
          content: 'توفر أجهزة الاستشعار المنتشرة في أحواض الأنهار بيانات في الوقت الفعلي عن مستوى المياه وهطول الأمطار.',
          icon: 'wifi'
        },
        {
          title: 'الحوسبة السحابية',
          content: 'توفر القوة الحسابية والتخزين اللازمين لمعالجة مجموعات البيانات الضخمة بشكل فوري.',
          icon: 'cloud'
        },
        {
          title: 'الروبوتات والطائرات بدون طيار',
          content: 'تستخدم لتقييم ما بعد الفيضانات ومراقبة المناطق التي يصعب الوصول إليها أثناء الأحداث.',
          icon: 'bot'
        }
      ],
      nextPage: 'الانتقال إلى الصفحة الثالثة',
      prevPage: 'العودة إلى الصفحة الأولى',
      chart: {
        ai: 'الذكاء الاصطناعي / تعلم الآلة',
        iot: 'إنترنت الأشياء',
        others: 'أخرى',
        cloud: 'الحوسبة السحابية',
        robotics: 'الروبوتات'
      }
    },
    pageThree: {
      title: 'الخاتمه والتوجيهات المستقبليه',
      content: 'يعد تكامل الذكاء الاصطناعي وإنترنت الأشياء والحوسبة السحابية أمراً ضرورياً للتنبؤ الحديث بالفيضانات. يجب أن تركز الأبحاث المستقبلية على تحسين دقة البيانات وتقليل زمن انتقال النظام.',
      sections: [
        {
          title: 'التحديات',
          content: 'تظل جودة البيانات وتكاليف التنفيذ المرتفعة وموثوقية البنية التحتية عقبات كبيرة. اضغط لمزيد من المعلومات.',
          moreInfo: 'تشمل التحديات الرئيسية جودة البيانات، حيث أن البيانات غير الدقيقة يمكن أن تؤدي إلى تنبؤات خاطئة. كما أن تكاليف التنفيذ المرتفعة للبنية التحتية لإنترنت الأشياء والحوسبة السحابية تشكل عائقاً للدول النامية. بالإضافة إلى ذلك، فإن موثوقية البنية التحتية في الظروف الجوية القاسية تعد تحدياً تقنياً كبيراً.',
          icon: 'alert'
        },
        {
          title: 'الفرص',
          content: 'توفر المراقبة العالمية في الوقت الفعلي وأنظمة الإنذار المبكر المجتمعية مسارات واعدة للمضي قدماً. اضغط لمزيد من المعلومات.',
          moreInfo: 'توفر التطورات في تكنولوجيا الأقمار الصناعية وشبكات الطاقة المنخفضة واسعة النطاق (LPWAN) فرصاً جديدة للمراقبة العالمية. يمكن للأنظمة المجتمعية المتكاملة مع تطبيقات الهاتف المحمول أن تقلل بشكل كبير من أوقات الاستجابة وتنقذ الأرواح.',
          icon: 'zap'
        }
      ],
      prevPage: 'العودة إلى الصفحة الثانية',
      nextPage: 'الانتقال إلى الصفحة الرابعة'
    },
    pageFour: {
      title: 'نقاط القوه والقيود والاجراءات الاوليه',
      content: 'ملخص للنتائج الرئيسية المتعلقة بفعالية التقنيات الناشئة في التنبؤ بالفيضانات.',
      sections: [
        {
          title: 'النتائج',
          content: 'دقة تنبؤية عالية، وقدرات مراقبة في الوقت الفعلي، وأنظمة إنذار مبكر مؤتمتة.',
          icon: 'trending-up'
        },
        {
          title: 'القيود',
          content: 'الاعتماد على جودة البيانات، والتكاليف الأولية المرتفعة، والتعقيد الفني في التكامل.',
          icon: 'alert-triangle'
        },
        {
          title: 'الإجراءات الأولوية',
          content: 'توحيد بروتوكولات البيانات، والاستثمار في البنية التحتية المرنة، وتعزيز التدريب المجتمعي.',
          icon: 'activity'
        }
      ],
      nextPage: 'الانتقال إلى الصفحة الخامسة',
      prevPage: 'العودة إلى الصفحة الثالثة'
    },
    pageFive: {
      title: 'عرض التوضيحي بالفيديو',
      content: 'شاهد هذا الفيديو لمعرفة المزيد عن تطبيقات الذكاء الاصطناعي في إدارة الكوارث.',
      videoTitle: 'فيديو توضيحي من اليوتيوب',
      prevPage: 'العودة إلى الصفحة الرابعة',
      nextPage: 'الانتقال إلى الصفحة السادسة'
    },
    pageSix: {
      title: 'تطور الابحاث من 2010 الى 2023',
      content: 'يوضح هذا الرسم البياني النمو في عدد المقالات العلمية المنشورة سنوياً حول التنبؤ بالفيضانات المفاجئة باستخدام التقنيات الناشئة.',
      xAxis: 'السنة',
      yAxis: 'عدد المقالات',
      mapTitle: 'توزيع الأبحاث عالمياً',
      mapLegend: 'عدد المنشورات حسب الدولة',
      frequencyTitle: 'تكرار الأبحاث حسب الدولة',
      frequencyLabel: 'التكرار',
      nextPage: 'الانتقال إلى الخاتمة',
      prevPage: 'العودة إلى الصفحة الخامسة'
    },
    pageSeven: {
      title: 'الخاتمة',
      whatWeKnowTitle: 'ما نعرفه (What we know)',
      whatWeKnowContent: 'يمكن للذكاء الاصطناعي/تعلم الآلة، وإنترنت الأشياء، والحوسبة السحابية التنبؤ بدقة بالمناطق المعرضة للفيضانات المفاجئة وإصدار تحذيرات في الوقت الفعلي تقريبًا؛ وتُعد خوارزميات RF و SVM مستخدمة على نطاق واسع وفعالة في العديد من الحالات.',
      whatRemainsTitle: 'ما يتبقى (What remains)',
      whatRemainsContent: 'تحتاج النماذج إلى التحسين، والتبرير النظري لاختيار المتغيرات، ومجموعات بيانات اختبار أفضل، والمرونة في مواجهة فقدان الاتصال، والتقييم باستخدام النتائج الملحوظة المتعلقة بالصحة والممتلكات.',
      prevPage: 'العودة إلى الصفحة السادسة',
      nextPage: 'انتهى'
    },
    pageEight: {
      title: 'انتهى',
      thankYou: 'شكراً',
      message: 'على انتباهكم وإصغائكم، نتمنى أنكم فهمتم الموضوع.',
      presentedBy: 'قدم من طرف',
      names: 'عصمان عبد القادر رضوان وسجراري حسام الدين',
      prevPage: 'العودة إلى الخاتمة'
    },
    robot: {
      welcome: 'أهلاً بك! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟',
      chatTitle: 'دردشة المساعد الآلي',
      placeholder: 'اكتب رسالتك هنا...',
      send: 'إرسال',
      thinking: 'جاري التفكير...'
    }
  }
};

// --- Components ---

const OSLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    {/* Ambient Glow */}
    <motion.div
      animate={{ 
        scale: [1, 1.15, 1],
        opacity: [0.4, 0.7, 0.4]
      }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-0 bg-amber-500/15 blur-3xl rounded-full"
    />
    
    <div className="relative z-10 flex items-center justify-center">
      <svg viewBox="0 0 220 120" className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
        <defs>
          {/* Metallic Gold Gradient */}
          <linearGradient id="metallicGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BF953F" />
            <stop offset="25%" stopColor="#FCF6BA" />
            <stop offset="50%" stopColor="#B38728" />
            <stop offset="75%" stopColor="#FBF5B7" />
            <stop offset="100%" stopColor="#AA771C" />
          </linearGradient>
          
          {/* Shine Effect Gradient */}
          <linearGradient id="shineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.6" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          
          <filter id="depthShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="2" dy="4" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <mask id="osMask">
            <g>
              {/* O Mask */}
              <circle cx="65" cy="60" r="40" fill="none" stroke="white" strokeWidth="10" />
              {/* S Mask */}
              <path 
                d="M 175 35 C 175 10 135 10 135 35 C 135 55 175 55 175 80 C 175 105 135 105 135 80" 
                fill="none" 
                stroke="white" 
                strokeWidth="14" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <circle cx="175" cy="35" r="5" fill="white" />
              <circle cx="135" cy="80" r="5" fill="white" />
            </g>
          </mask>
        </defs>

        <g>
          {/* Decorative Background Capsule */}
          <motion.rect
            x="20" y="15" width="180" height="90" rx="45"
            fill="none"
            stroke="url(#metallicGold)"
            strokeWidth="1"
            strokeDasharray="4 8"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          
          {/* Main Logo Elements with 3D Perspective */}
          <g style={{ filter: 'url(#depthShadow)' }}>
            {/* Letter O */}
            <motion.circle
              cx="65" cy="60" r="40"
              fill="none"
              stroke="url(#metallicGold)"
              strokeWidth="10"
              strokeOpacity="0.9"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            
            {/* Letter S */}
            <motion.path
              d="M 175 35 C 175 10 135 10 135 35 C 135 55 175 55 175 80 C 175 105 135 105 135 80"
              fill="none"
              stroke="url(#metallicGold)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
            />

            {/* S Flourishes */}
            <motion.circle
              cx="175" cy="35" r="5"
              fill="url(#metallicGold)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.8, duration: 0.5 }}
            />
            <motion.circle
              cx="135" cy="80" r="5"
              fill="url(#metallicGold)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.8, duration: 0.5 }}
            />
            
            {/* Animated Shine */}
            <motion.rect
              x="0" y="0" width="220" height="120"
              fill="url(#shineGrad)"
              mask="url(#osMask)"
              animate={{ 
                x: [-220, 220],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                repeatDelay: 1,
                ease: "easeInOut" 
              }}
              style={{ pointerEvents: 'none' }}
            />
          </g>
          
          {/* Decorative Tech Dots */}
          {[
            {x: 20, y: 60}, {x: 200, y: 60}, {x: 110, y: 15}, {x: 110, y: 105}
          ].map((pos, i) => (
            <motion.circle
              key={i}
              cx={pos.x} cy={pos.y} r="2"
              fill="#FBBF24"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </g>
      </svg>
    </div>
    
    {/* Outer Rotating Dashed Ring */}
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 border border-dashed border-amber-500/10 rounded-full scale-[1.7]"
    />
  </div>
);

const AICouldLogo = OSLogo;

const WorldMap3D = ({ t, theme }: { t: Translation, theme: Theme }) => {
  const [geography, setGeography] = useState<any>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{ name: string, code: string } | null>(null);

  const countryInfo: Record<string, { count: number, code: string }> = {
    "China": { count: 7, code: "CN" },
    "Iran": { count: 6, code: "IR" },
    "United States of America": { count: 5, code: "US" },
    "India": { count: 4, code: "IN" },
    "Vietnam": { count: 3, code: "VN" },
    "Brazil": { count: 2, code: "BR" },
    "Egypt": { count: 2, code: "EG" },
    "Italy": { count: 2, code: "IT" },
    "South Korea": { count: 1, code: "KR" },
    "Malaysia": { count: 1, code: "MY" },
    "Indonesia": { count: 1, code: "ID" },
    "Philippines": { count: 1, code: "PH" },
    "Greece": { count: 1, code: "GR" },
    "Turkey": { count: 1, code: "TR" },
    "Thailand": { count: 1, code: "TH" },
    "Iraq": { count: 1, code: "IQ" },
  };

  const colorScale: Record<number, string> = {
    7: "#1a5276", // Dark Blue
    6: "#e67e22", // Orange
    5: "#1d8348", // Dark Green
    4: "#3498db", // Light Blue
    3: "#8e44ad", // Purple
    2: "#52be80", // Green
    1: "#17202a", // Dark Navy
  };

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(response => response.json())
      .then(data => {
        const countries = topojson.feature(data, data.objects.countries) as any;
        setGeography(countries.features);
      })
      .catch(err => console.error("Error loading map data:", err));
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 300, damping: 30 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = (mouseX / width - 0.5) * 200;
    const yPct = (mouseY / height - 0.5) * 200;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setHoveredCountry(null);
  }

  const projection = d3.geoMercator().scale(120).translate([400, 280]);
  const pathGenerator = d3.geoPath().projection(projection);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative w-full max-w-5xl mx-auto p-10 rounded-[3rem] border shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 ${
        theme === 'dark' ? 'bg-slate-900/90 border-slate-700 backdrop-blur-2xl' : 'bg-white/90 border-slate-200 backdrop-blur-2xl'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/5 rounded-[3rem] pointer-events-none" />
      
      <div className="relative z-10 text-center mb-8">
        <h3 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
          {t.pageSix.mapTitle}
        </h3>
        <div className="w-20 h-1.5 bg-blue-500 mx-auto mt-3 rounded-full" />
      </div>

      <div className="relative z-10 w-full h-[500px] overflow-hidden flex items-center justify-center">
        {!geography ? (
          <div className="flex items-center gap-3 text-blue-500 font-bold animate-pulse">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            Loading Map...
          </div>
        ) : (
          <svg viewBox="0 0 800 500" className="w-full h-full">
            <g>
              {geography.map((feature: any) => {
                const countryName = feature.properties.name;
                const info = countryInfo[countryName];
                const count = info?.count || 0;
                const fillColor = count > 0 ? colorScale[count] : (theme === 'dark' ? '#1e293b' : '#f1f5f9');
                const isHovered = hoveredCountry === countryName;
                const isSelected = selectedCountry?.name === countryName;

                return (
                  <motion.path
                    key={feature.id}
                    d={pathGenerator(feature) || ""}
                    fill={fillColor}
                    stroke={isSelected ? '#3b82f6' : (theme === 'dark' ? '#0f172a' : '#ffffff')}
                    strokeWidth={isSelected ? 3 : (isHovered ? 2 : 0.5)}
                    onMouseEnter={() => setHoveredCountry(countryName)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    onClick={() => {
                      if (info) {
                        setSelectedCountry({ name: countryName, code: info.code });
                      } else {
                        setSelectedCountry(null);
                      }
                    }}
                    whileHover={{ scale: 1.02, zIndex: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ cursor: count > 0 ? 'pointer' : 'default' }}
                  />
                );
              })}
            </g>
          </svg>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-4 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
          {[7, 6, 5, 4, 3, 2, 1].map(val => (
            <div key={val} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm shadow-sm" style={{ backgroundColor: colorScale[val] }} />
              <span className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{val}</span>
            </div>
          ))}
        </div>

        {/* Selected Country Info with Flag */}
        <AnimatePresence>
          {selectedCountry && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="absolute top-4 left-4 p-6 rounded-[2rem] bg-white dark:bg-slate-800 shadow-2xl border border-blue-500/30 z-30 flex flex-col items-center gap-4 min-w-[200px]"
            >
              <button 
                onClick={() => setSelectedCountry(null)}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
              
              <div className="w-20 h-14 rounded-lg overflow-hidden shadow-md border border-slate-200 dark:border-slate-700">
                <img 
                  src={`https://flagcdn.com/w160/${selectedCountry.code.toLowerCase()}.png`} 
                  alt={`${selectedCountry.name} flag`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="text-center">
                <p className="font-black text-xl text-blue-500">{selectedCountry.name}</p>
                <p className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {countryInfo[selectedCountry.name].count} {t.pageSix.yAxis}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredCountry && !selectedCountry && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute top-4 right-4 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 z-20 pointer-events-none"
            >
              <p className="font-black text-blue-500">{hoveredCountry}</p>
              <p className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {countryInfo[hoveredCountry]?.count || 0} {t.pageSix.yAxis}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const HorizontalBarChart3D = ({ t, theme, isRtl }: { t: Translation, theme: Theme, isRtl: boolean }) => {
  const data = [
    { country: 'China', frequency: 7, code: 'CN' },
    { country: 'Iran', frequency: 6, code: 'IR' },
    { country: 'United States', frequency: 5, code: 'US' },
    { country: 'India', frequency: 4, code: 'IN' },
    { country: 'Malaysia', frequency: 3, code: 'MY' },
    { country: 'Vietnam', frequency: 3, code: 'VN' },
    { country: 'Romania', frequency: 2, code: 'RO' },
    { country: 'Egypt', frequency: 2, code: 'EG' },
    { country: 'Brazil', frequency: 2, code: 'BR' },
    { country: 'Indonesia', frequency: 1, code: 'ID' },
    { country: 'Tunisia', frequency: 1, code: 'TN' },
    { country: 'Philippines', frequency: 1, code: 'PH' },
    { country: 'Bangladesh', frequency: 1, code: 'BD' },
    { country: 'United Arab Emirates', frequency: 1, code: 'AE' },
    { country: 'Greece', frequency: 1, code: 'GR' },
    { country: 'Morocco', frequency: 1, code: 'MA' },
  ].reverse();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]), { stiffness: 300, damping: 30 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = (mouseX / width - 0.5) * 200;
    const yPct = (mouseY / height - 0.5) * 200;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const item = data.find(d => d.country === payload.value);
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text 
          x={-10} 
          y={0} 
          dy={4} 
          textAnchor="end" 
          fill={theme === 'dark' ? '#94a3b8' : '#475569'}
          className="text-[11px] font-bold tracking-tight"
        >
          {payload.value}
        </text>
        {item && (
          <image
            x={-145}
            y={-8}
            width="16"
            height="12"
            href={`https://flagcdn.com/w40/${item.code.toLowerCase()}.png`}
            preserveAspectRatio="xMidYMid slice"
          />
        )}
      </g>
    );
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative w-full max-w-5xl mx-auto p-10 rounded-[3rem] border shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 ${
        theme === 'dark' ? 'bg-slate-900/90 border-slate-700 backdrop-blur-2xl' : 'bg-white/90 border-slate-200 backdrop-blur-2xl'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-[3rem] pointer-events-none" />
      
      <div className="relative z-10 text-center mb-10">
        <h3 className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
          {t.pageSix.frequencyTitle}
        </h3>
        <div className="w-24 h-1.5 bg-blue-500 mx-auto mt-4 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
      </div>

      <div className="relative z-10 h-[700px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 50, left: 40, bottom: 20 }}
            barSize={24}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="barGradientTop" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#dc2626" stopOpacity={1} />
              </linearGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                <feOffset dx="1" dy="1" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} 
              horizontal={false} 
              opacity={0.5}
            />
            
            <XAxis 
              type="number" 
              domain={[0, 8]} 
              stroke={theme === 'dark' ? '#64748b' : '#94a3b8'}
              tick={{ fontSize: 12, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            
            <YAxis 
              dataKey="country" 
              type="category" 
              width={160}
              tick={<CustomYAxisTick />}
              axisLine={false}
              tickLine={false}
            />
            
            <Tooltip 
              cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl ${
                      theme === 'dark' ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-slate-200'
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        <img 
                          src={`https://flagcdn.com/w40/${item.code.toLowerCase()}.png`} 
                          alt={item.country}
                          className="w-6 h-4 rounded shadow-sm"
                        />
                        <span className={`font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                          {item.country}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          {t.pageSix.frequencyLabel}: <span className="text-blue-500">{item.frequency}</span>
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            <Bar 
              dataKey="frequency" 
              radius={[0, 12, 12, 0]}
              animationDuration={2000}
              animationEasing="ease-out"
              filter="url(#shadow)"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.country === 'China' ? 'url(#barGradientTop)' : 'url(#barGradient)'}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 flex justify-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          <span className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Peak Frequency</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          <span className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Standard Frequency</span>
        </div>
      </div>
    </motion.div>
  );
};

const BarChart3D = ({ t, theme }: { t: Translation, theme: Theme }) => {
  const data = [
    { year: '2010', articles: 1 },
    { year: '2013', articles: 1 },
    { year: '2014', articles: 1 },
    { year: '2015', articles: 1 },
    { year: '2017', articles: 2 },
    { year: '2018', articles: 4 },
    { year: '2019', articles: 3 },
    { year: '2020', articles: 9 },
    { year: '2021', articles: 13 },
    { year: '2022', articles: 7 },
    { year: '2023', articles: 8 },
  ];

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 300, damping: 30 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = (mouseX / width - 0.5) * 200;
    const yPct = (mouseY / height - 0.5) * 200;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative w-full max-w-5xl mx-auto p-10 rounded-[3rem] border shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 ${
        theme === 'dark' ? 'bg-slate-900/90 border-slate-700 backdrop-blur-2xl' : 'bg-white/90 border-slate-200 backdrop-blur-2xl'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/5 rounded-[3rem] pointer-events-none" />
      
      <div className="relative z-10 text-center mb-8">
        <h3 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
          {t.pageSix.title}
        </h3>
        <div className="w-20 h-1.5 bg-blue-500 mx-auto mt-3 rounded-full" />
      </div>

      <div className="relative z-10 h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
            <XAxis 
              dataKey="year" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 'bold' }}
              label={{ value: t.pageSix.xAxis, position: 'insideBottom', offset: -10, fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 14, fontWeight: 'bold' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 'bold' }}
              label={{ value: t.pageSix.yAxis, angle: -90, position: 'insideLeft', fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 14, fontWeight: 'bold' }}
            />
            <Tooltip 
              cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f1f5f9', opacity: 0.4 }}
              contentStyle={{ 
                borderRadius: '1rem', 
                border: 'none', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                color: theme === 'dark' ? '#f8fafc' : '#1e293b'
              }}
            />
            <Bar 
              dataKey="articles" 
              fill="#3b82f6" 
              radius={[8, 8, 0, 0]} 
              barSize={40}
              animationDuration={1500}
              label={{ position: 'top', fill: theme === 'dark' ? '#f8fafc' : '#1e293b', fontSize: 12, fontWeight: 'bold' }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 8 ? '#ef4444' : '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

const PieChart3D = ({ t, theme, isRtl, lang }: { t: Translation, theme: Theme, isRtl: boolean, lang: Language }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const data = [
    { name: t.pageTwo.chart.ai, value: 64, color: '#3b82f6', gradient: ['#3b82f6', '#1d4ed8'] },
    { name: t.pageTwo.chart.iot, value: 19, color: '#f97316', gradient: ['#f97316', '#c2410c'] },
    { name: t.pageTwo.chart.others, value: 9, color: '#60a5fa', gradient: ['#60a5fa', '#2563eb'] },
    { name: t.pageTwo.chart.cloud, value: 6, color: '#94a3b8', gradient: ['#94a3b8', '#475569'] },
    { name: t.pageTwo.chart.robotics, value: 2, color: '#eab308', gradient: ['#eab308', '#a16207'] },
  ];

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 300, damping: 30 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = (mouseX / width - 0.5) * 200;
    const yPct = (mouseY / height - 0.5) * 200;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="2" dy="4" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          filter="url(#shadow)"
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 12}
          outerRadius={outerRadius + 15}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative w-full max-w-3xl mx-auto p-10 rounded-[3rem] border shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 ${
        theme === 'dark' ? 'bg-slate-900/90 border-slate-700 backdrop-blur-2xl' : 'bg-white/90 border-slate-200 backdrop-blur-2xl'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/5 rounded-[3rem] pointer-events-none" />
      
      <div className="relative z-10 text-center mb-8">
        <motion.h3 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}
        >
          {lang === 'ar' ? 'توزيع التقنيات في الأبحاث' : lang === 'fr' ? 'Distribution Technologique dans la Recherche' : 'Technological Distribution in Research'}
        </motion.h3>
        <div className="w-20 h-1.5 bg-blue-500 mx-auto mt-3 rounded-full" />
      </div>

      <div className="relative z-10 h-[450px] w-full flex items-center justify-center">
        {/* Center Label */}
        <div className="absolute pointer-events-none flex flex-col items-center justify-center text-center z-20">
          <AnimatePresence mode="wait">
            {activeIndex !== null ? (
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                <span className="text-4xl font-black text-blue-500 drop-shadow-sm">
                  {data[activeIndex].value}%
                </span>
                <span className={`text-sm font-bold max-w-[120px] leading-tight mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {data[activeIndex].name}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center"
              >
                <Activity className="w-8 h-8 text-slate-300 mb-2" />
                <span className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                  {lang === 'ar' ? 'مرر للمزيد' : lang === 'fr' ? 'Survoler' : 'Hover to Explore'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex ?? undefined}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={130}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  style={{ 
                    filter: activeIndex === index ? 'none' : 'brightness(0.95)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<></>} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 relative z-10">
        {data.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
              activeIndex === i 
                ? 'bg-blue-500/10 border-blue-500/50 scale-105' 
                : theme === 'dark' ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-100'
            }`}
          >
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <div className="flex flex-col">
              <span className={`text-[10px] font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                {item.value}%
              </span>
              <span className={`text-xs font-bold truncate max-w-[100px] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                {item.name}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const ArrowGraphic = ({ items, isRtl }: { items: string[], isRtl: boolean }) => (
  <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto py-12 [perspective:1500px]">
    {items.map((item, idx) => (
      <motion.div
        key={idx}
        initial={{ 
          x: isRtl ? 100 : -100, 
          opacity: 0, 
          rotateY: isRtl ? -30 : 30,
          scale: 0.9
        }}
        whileInView={{ 
          x: 0, 
          opacity: 1, 
          rotateY: isRtl ? -20 : 20,
          scale: 1
        }}
        whileHover={{ 
          rotateY: isRtl ? -10 : 10,
          scale: 1.05,
          transition: { duration: 0.3 }
        }}
        whileTap={{ 
          scale: 0.95,
          rotateY: isRtl ? -5 : 5,
          transition: { duration: 0.1 }
        }}
        transition={{ delay: idx * 0.2, duration: 0.8, type: "spring" }}
        className="relative flex items-center group"
        style={{ 
          width: `${70 + idx * 10}%`, 
          alignSelf: isRtl ? 'flex-end' : 'flex-start',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* 3D Shadow */}
        <div 
          className="absolute inset-0 bg-black/40 blur-xl translate-y-8 translate-x-4 opacity-50"
          style={{ 
            clipPath: isRtl 
              ? 'polygon(5% 0%, 100% 0%, 100% 100%, 5% 100%, 0% 50%)' 
              : 'polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%)' 
          }}
        />
        
        {/* Main Arrow Body */}
        <div 
          className={`h-20 flex items-center px-10 text-2xl font-black relative z-10 w-full border-t border-white/20 ${
            idx === 0 ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white' : 
            idx === 1 ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 text-white' : 
            'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 text-white'
          }`}
          style={{ 
            clipPath: isRtl 
              ? 'polygon(5% 0%, 100% 0%, 100% 100%, 5% 100%, 0% 50%)' 
              : 'polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%)',
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))'
          }}
        >
          <span className={`${isRtl ? 'mr-12' : 'ml-4'} drop-shadow-lg`}>
            {item}
          </span>
          
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 pointer-events-none" />
        </div>
      </motion.div>
    ))}
  </div>
);

const useTTS = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = async (text: string, lang: Language) => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const voiceName = 'Kore'; 
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Read this clearly: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioSrc = `data:audio/wav;base64,${base64Audio}`;
        if (audioRef.current) {
          audioRef.current.src = audioSrc;
          audioRef.current.play();
        } else {
          const audio = new Audio(audioSrc);
          audioRef.current = audio;
          audio.play();
          audio.onended = () => setIsPlaying(false);
        }
      } else {
        throw new Error("No audio data received");
      }
    } catch (error) {
      console.warn("Gemini TTS failed, falling back to browser speech synthesis:", error);
      
      // Fallback to browser's native SpeechSynthesis
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Map app language to BCP 47 language tags
      const langMap: Record<Language, string> = {
        'en': 'en-US',
        'fr': 'fr-FR',
        'ar': 'ar-SA'
      };
      utterance.lang = langMap[lang] || 'en-US';
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return { speak, isPlaying };
};

const SplashScreen = ({ onComplete, t, lang }: { onComplete: () => void, t: Translation, lang: Language }) => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
    transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
    className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden"
    style={{ perspective: '1000px' }}
  >
    {/* Animated Background Elements */}
    <div className="absolute inset-0 z-0 opacity-20">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 - 50 + '%', 
            y: Math.random() * 100 - 50 + '%',
            z: Math.random() * -1000,
            opacity: 0 
          }}
          animate={{ 
            z: 500,
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: Math.random() * 5 + 5, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
        />
      ))}
    </div>

    <motion.div
      initial={{ rotateX: 45, rotateY: -45, z: -500, opacity: 0 }}
      animate={{ rotateX: 0, rotateY: 0, z: 0, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="relative z-10 flex flex-col items-center"
    >
      <div className="relative mb-12">
        <motion.div
          animate={{ 
            rotateY: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotateY: { duration: 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative"
        >
          <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full scale-150" />
          <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-950 rounded-3xl shadow-[0_0_50px_rgba(217,119,6,0.3)] border border-amber-500/20 backdrop-blur-xl relative z-10">
            <OSLogo className="w-24 h-24" />
          </div>
        </motion.div>
      </div>

      <motion.h1 
        initial={{ y: 50, opacity: 0, rotateX: -90 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-4xl md:text-6xl font-black text-white text-center tracking-tighter mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
      >
        {t.hero.title}
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-blue-400 font-bold uppercase tracking-[0.3em] text-sm mb-12"
      >
        {t.hero.subtitle}
      </motion.p>

      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(59,130,246,0.6)' }}
        whileTap={{ scale: 0.9, y: 10, boxShadow: '0 0 10px rgba(59,130,246,0.3)' }}
        onClick={onComplete}
        className="px-12 py-4 bg-white text-slate-950 font-black rounded-full transition-all flex items-center gap-3 group shadow-[0_10px_0_rgba(0,0,0,0.2)] active:shadow-none"
      >
        {lang === 'ar' ? 'ابدأ المراجعة' : 'Start Review'}
        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  </motion.div>
);

const RobotAssistant = ({ t, lang, isRtl, theme }: { t: Translation, lang: Language, isRtl: boolean, theme: Theme }) => {
  const [showBubble, setShowBubble] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { speak, isPlaying } = useTTS();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true);
      speak(t.robot.welcome, lang);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);
    setShowBubble(false);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `You are a helpful robotic assistant for a scientific review application about Flash Flood Prediction using AI, IoT, and Cloud. Answer concisely in ${lang === 'ar' ? 'Arabic' : lang === 'fr' ? 'French' : 'English'}. User says: ${userMsg}` }] }
        ],
      });

      const botMsg = response.text || "I'm sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: 'bot', text: botMsg }]);
      speak(botMsg, lang);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Error connecting to AI." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`fixed bottom-0 ${isRtl ? 'left-0' : 'right-0'} z-[60] flex flex-col items-center pointer-events-none`}>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            className={`w-[350px] h-[500px] rounded-3xl shadow-2xl border flex flex-col mb-6 pointer-events-auto mx-6 overflow-hidden ${
              theme === 'dark' 
                ? 'bg-slate-800/95 border-slate-700 text-white backdrop-blur-xl' 
                : 'bg-white/95 border-slate-300 text-slate-800 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)]'
            }`}
          >
            {/* Chat Header */}
            <div className={`p-4 border-b flex items-center justify-between ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-sm">{t.robot.chatTitle}</span>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 hover:bg-slate-500/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-500">
              {messages.length === 0 && (
                <div className="text-center py-10 opacity-50">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">{t.robot.welcome}</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : theme === 'dark' ? 'bg-slate-700 text-white rounded-tl-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className={`p-3 rounded-2xl rounded-tl-none text-xs animate-pulse ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
                    {t.robot.thinking}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className={`p-4 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-100'}`}>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={t.robot.placeholder}
                  className={`flex-1 px-4 py-2 rounded-full text-sm outline-none transition-all ${
                    theme === 'dark' 
                      ? 'bg-slate-700 border-slate-600 focus:border-blue-500' 
                      : 'bg-slate-100 border-slate-200 focus:border-blue-400'
                  } border`}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col items-center"
      >
        <AnimatePresence>
          {showBubble && !isChatOpen && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              className={`max-w-xs p-5 rounded-3xl shadow-2xl border relative mb-6 pointer-events-auto mx-6 ${
                theme === 'dark' 
                  ? 'bg-slate-800/90 border-slate-700 text-white backdrop-blur-xl' 
                  : 'bg-white/90 border-slate-300 text-slate-800 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.1)]'
              }`}
            >
              <button 
                onClick={() => setShowBubble(false)}
                className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-base leading-relaxed font-bold">
                {t.robot.welcome}
              </p>
              <div className={`absolute bottom-[-10px] ${isRtl ? 'left-10' : 'right-10'} w-5 h-5 rotate-45 border-r border-b ${
                theme === 'dark' ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-slate-200'
              }`} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 1, -1, 0]
          }}
          whileTap={{ 
            scale: 0.9, 
            rotate: 5, 
            y: 20,
            transition: { duration: 0.1 }
          }}
          transition={{ 
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative pointer-events-auto cursor-pointer group"
          onClick={() => {
            if (isChatOpen) {
              setIsChatOpen(false);
            } else {
              setIsChatOpen(true);
              setShowBubble(false);
            }
          }}
        >
          {/* AI Core Assistant Icon */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
            <motion.div
              animate={{ 
                scale: isPlaying ? [1, 1.1, 1] : 1,
                rotate: isPlaying ? [0, 5, -5, 0] : 0
              }}
              transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* Outer Glowing Rings */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-blue-500/20 rounded-full"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border border-blue-400/10 rounded-full"
              />
              
              {/* Central AI Icon Container */}
              <div className="relative w-4/5 h-4/5 rounded-full flex items-center justify-center border-2 border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.3)] bg-blue-500/5 backdrop-blur-md overflow-hidden">
                <motion.div
                  animate={{ 
                    opacity: [0.4, 0.7, 0.4],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent"
                />
                
                <span className={`text-3xl md:text-5xl font-black tracking-tighter transition-all duration-500 ${isPlaying ? 'text-blue-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.8)]' : 'text-blue-500/60'}`}>
                  IA
                </span>
                
                {/* Scanning Line Effect */}
                <motion.div 
                  animate={{ y: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-x-0 h-1 bg-blue-400/20 blur-sm"
                />
              </div>
            </motion.div>
            
            {/* Status Indicator */}
            <div className="absolute top-[15%] right-[15%] w-4 h-4 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            
            {/* Voice Waves when speaking */}
            {isPlaying && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [10, 30, 10] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1 bg-blue-500 rounded-full"
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showRobot, setShowRobot] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('dark');
  const [showGeneralIdea, setShowGeneralIdea] = useState(false);
  const [showDetailedExplanation, setShowDetailedExplanation] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmSection, setConfirmSection] = useState<{ title: string; content: string; icon: string } | null>(null);
  const [openSubSections, setOpenSubSections] = useState<number[]>([]);
  const [openItems, setOpenItems] = useState<Record<number, number | null>>({});
  const [zoomedItem, setZoomedItem] = useState<{ title: string; content: string } | null>(null);
  const [zoomedConclusion, setZoomedConclusion] = useState<string | null>(null);
  const [showIndexMenu, setShowIndexMenu] = useState(false);
  const { speak, isPlaying } = useTTS();

  const toggleSubSection = (idx: number) => {
    setOpenSubSections(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const toggleItem = (sectionIdx: number, itemIdx: number, item: { title: string; content?: string }) => {
    if (item.content) {
      setZoomedItem({ title: item.title, content: item.content });
    } else {
      setOpenItems(prev => ({
        ...prev,
        [sectionIdx]: prev[sectionIdx] === itemIdx ? null : itemIdx
      }));
    }
  };

  const t = translations[lang];
  const isRtl = lang === 'ar';

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div 
      className={`min-h-screen transition-colors duration-500 selection:bg-blue-100 selection:text-blue-900 ${isRtl ? 'rtl' : 'ltr'} ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => {
          setShowSplash(false);
          setShowRobot(true);
        }} t={t} lang={lang} />}
      </AnimatePresence>

      <AnimatePresence>
        {showRobot && !showSplash && <RobotAssistant t={t} lang={lang} isRtl={isRtl} theme={theme} />}
      </AnimatePresence>

      {/* Zoomed Item Modal */}
      <AnimatePresence>
        {zoomedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedItem(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative max-w-2xl w-full p-8 md:p-12 rounded-[2.5rem] border shadow-2xl cursor-default ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300 shadow-[0_20px_50px_rgba(0,0,0,0.1)]'}`}
            >
              <button
                onClick={() => setZoomedItem(null)}
                className="absolute -top-4 -right-4 p-3 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="space-y-6 text-center">
                <div className="inline-flex p-4 rounded-2xl bg-blue-500/10 text-blue-500">
                  <Info className="w-10 h-10" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                  {zoomedItem.title}
                </h2>
                <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full" />
                <p className={`text-xl md:text-2xl leading-relaxed font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {zoomedItem.content}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Video */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          key={theme}
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full object-cover blur-[2px] transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-40' : 'opacity-20'}`}
        >
          <source src={theme === 'dark' 
            ? "https://assets.mixkit.co/videos/preview/mixkit-dark-clouds-moving-fast-in-the-sky-4310-large.mp4"
            : "https://assets.mixkit.co/videos/preview/mixkit-clouds-moving-fast-in-the-sky-4309-large.mp4"} type="video/mp4" />
        </video>
        <div className={`absolute inset-0 transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-white/40'}`} />
      </div>

      {/* Fixed Navigation Buttons - Visible on all pages except splash */}
      {!showSplash && (
        <div className={`fixed top-6 ${isRtl ? 'left-6' : 'right-6'} z-50 flex gap-3`}>
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setCurrentPage(1);
              setShowGeneralIdea(false);
              setShowDetailedExplanation(false);
              setShowIndexMenu(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`p-3 rounded-full shadow-xl backdrop-blur-md border transition-all flex items-center gap-2 group ${
              theme === 'dark' 
                ? 'bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700' 
                : 'bg-white/80 border-slate-200 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-xs font-bold uppercase tracking-widest">
              {lang === 'ar' ? 'الرئيسية' : lang === 'fr' ? 'Accueil' : 'Home'}
            </span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowIndexMenu(!showIndexMenu)}
            className={`p-3 rounded-full shadow-xl backdrop-blur-md border transition-all flex items-center gap-2 group ${
              theme === 'dark' 
                ? 'bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700' 
                : 'bg-white/80 border-slate-200 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <List className="w-5 h-5" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-xs font-bold uppercase tracking-widest">
              {lang === 'ar' ? 'الفهرس' : lang === 'fr' ? 'Index' : 'Index'}
            </span>
          </motion.button>
        </div>
      )}

      {/* Index Menu Modal */}
      <AnimatePresence>
        {showIndexMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl"
            onClick={() => setShowIndexMenu(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className={`relative max-w-2xl w-full p-8 rounded-[2.5rem] border shadow-2xl ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300 shadow-[0_20px_50px_rgba(0,0,0,0.15)]'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                    <List className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter">
                    {lang === 'ar' ? 'فهرس المحتويات' : lang === 'fr' ? 'Table des Matières' : 'Table of Contents'}
                  </h2>
                </div>
                <button 
                  onClick={() => setShowIndexMenu(false)}
                  className="p-2 hover:bg-slate-500/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 1, title: lang === 'ar' ? 'مقدمه' : lang === 'fr' ? 'Introduction' : 'Introduction', icon: <Zap className="w-4 h-4" /> },
                  { id: 2, title: lang === 'ar' ? 'تحليل التكامل التكنولوجي' : lang === 'fr' ? "Analyse de l'intégration technologique" : 'Technology Integration Analysis', icon: <Cpu className="w-4 h-4" /> },
                  { id: 3, title: lang === 'ar' ? 'الخاتمه والتوجيهات المستقبليه' : lang === 'fr' ? 'Conclusion et orientations futures' : 'Conclusion and Future Directions', icon: <ShieldCheck className="w-4 h-4" /> },
                  { id: 4, title: lang === 'ar' ? 'نقاط القوه والقيود والاجراءات الاوليه' : lang === 'fr' ? 'Forces, limites et actions initiales' : 'Strengths, Limitations, and Initial Actions', icon: <AlertTriangle className="w-4 h-4" /> },
                  { id: 5, title: lang === 'ar' ? 'عرض التوضيحي بالفيديو' : lang === 'fr' ? 'Démonstration vidéo' : 'Video Demonstration', icon: <Activity className="w-4 h-4" /> },
                  { id: 6, title: lang === 'ar' ? 'تطور الابحاث من 2010 الى 2023' : lang === 'fr' ? 'Évolution de la recherche 2010-2023' : 'Research Evolution 2010-2023', icon: <TrendingUp className="w-4 h-4" /> },
                  { id: 7, title: lang === 'ar' ? 'الخاتمة' : lang === 'fr' ? 'Conclusion' : 'Conclusion', icon: <Globe className="w-4 h-4" /> },
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setShowGeneralIdea(false);
                      setShowDetailedExplanation(false);
                      setShowIndexMenu(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                      currentPage === item.id 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                        : theme === 'dark' ? 'bg-slate-800/50 border-slate-700 hover:border-blue-500/50' : 'bg-slate-50 border-slate-200 hover:border-blue-400/50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${currentPage === item.id ? 'bg-white/20' : 'bg-blue-500/10 text-blue-500'}`}>
                      {item.icon}
                    </div>
                    <span className="font-bold text-sm">{item.title}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme & Lang Toggle - Moved to bottom corner to be far from logo */}
      <div className={`fixed bottom-6 ${isRtl ? 'right-6' : 'left-6'} z-50 flex flex-col md:flex-row gap-3 items-end md:items-center`}>
        <div className="flex gap-2 p-1 rounded-full border backdrop-blur-md bg-white/10 border-white/20 shadow-xl">
          {(['en', 'ar', 'fr'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                lang === l 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-slate-900/60 hover:text-slate-900'
              }`}
            >
              {l === 'en' ? 'EN' : l === 'ar' ? 'عربي' : 'FR'}
            </button>
          ))}
        </div>
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-full border transition-all backdrop-blur-md ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-slate-900/10 border-slate-900/20 text-slate-900 hover:bg-slate-900/20'}`}
        >
          {theme === 'dark' ? <Zap className="w-5 h-5" /> : <CloudRain className="w-5 h-5" />}
        </button>
      </div>

      {/* Header */}
      <AnimatePresence>
        {currentPage === 1 && (
          <header className="relative z-10 pt-24 pb-12 px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                {t.hero.title}
              </h1>
              <p className={`text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {t.hero.subtitle}
              </p>
            </motion.div>
          </header>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`relative max-w-md w-full p-8 rounded-[2.5rem] border shadow-2xl text-center ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300 shadow-[0_20px_50px_rgba(0,0,0,0.1)]'}`}
            >
              <div className="space-y-6">
                <div className="inline-flex p-6 rounded-full bg-blue-500/10 text-blue-500 animate-bounce">
                  {confirmSection.icon === 'cpu' && <Cpu className="w-12 h-12" />}
                  {confirmSection.icon === 'wifi' && <Wifi className="w-12 h-12" />}
                  {confirmSection.icon === 'cloud' && <Cloud className="w-12 h-12" />}
                  {confirmSection.icon === 'bot' && <Bot className="w-12 h-12" />}
                </div>
                <h3 className="text-2xl font-bold">
                  {lang === 'ar' ? 'هل تود عرض التفاصيل؟' : lang === 'fr' ? 'Voulez-vous voir les détails ?' : 'Would you like to see the details?'}
                </h3>
                <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                  {confirmSection.title}
                </p>
                <div className="flex gap-4 pt-4">
                  <motion.button
                    onClick={() => setConfirmSection(null)}
                    whileTap={{ scale: 0.95, y: 2 }}
                    className={`flex-1 py-3 rounded-2xl font-bold transition-all ${theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-none' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-[0_4px_0_rgba(0,0,0,0.1)] active:shadow-none'}`}
                  >
                    {lang === 'ar' ? 'إلغاء' : lang === 'fr' ? 'Annuler' : 'Cancel'}
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setZoomedItem({ title: confirmSection.title, content: confirmSection.content });
                      setConfirmSection(null);
                    }}
                    whileTap={{ scale: 0.95, y: 2 }}
                    className="flex-1 py-3 rounded-2xl font-bold bg-blue-500 text-white hover:bg-blue-600 shadow-[0_4px_0_rgba(37,99,235,0.4)] active:shadow-none transition-all"
                  >
                    {lang === 'ar' ? 'تأكيد' : lang === 'fr' ? 'Confirmer' : 'Confirm'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pb-24 space-y-12">
        <AnimatePresence mode="wait">
          {currentPage === 1 ? (
            <motion.div
              key="page-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Section 1: General Idea */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={`p-8 md:p-12 rounded-3xl border transition-all duration-500 shadow-xl ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 backdrop-blur-md' : 'bg-white/90 border-slate-300 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-md'}`}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Globe className="w-8 h-8 text-blue-500" />
              {t.generalIdea.title}
            </h2>
            {showGeneralIdea && (
              <button
                onClick={() => speak(t.generalIdea.content, lang)}
                className={`p-3 rounded-full transition-all ${isPlaying ? 'bg-blue-500 text-white animate-pulse' : 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'}`}
              >
                <Activity className="w-6 h-6" />
              </button>
            )}
          </div>
          
          <AnimatePresence mode="wait">
            {!showGeneralIdea ? (
              <motion.div
                key="browse-btn"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex justify-center py-8"
              >
                <motion.button
                  onClick={() => setShowGeneralIdea(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95, y: 4 }}
                  className={`group flex items-center gap-3 px-10 py-5 rounded-2xl text-xl font-bold transition-all ${
                    theme === 'dark' 
                      ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_10px_0_rgba(37,99,235,0.3)]' 
                      : 'bg-blue-500 text-white hover:bg-blue-600 shadow-[0_10px_0_rgba(59,130,246,0.3)]'
                  }`}
                >
                  <Search className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  {t.generalIdea.browse}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <p className={`text-lg md:text-xl leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t.generalIdea.content}
                </p>

                <button 
                  onClick={() => setShowGeneralIdea(false)}
                  className={`mt-6 text-sm font-bold flex items-center gap-2 transition-colors ${theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <X className="w-4 h-4" />
                  {lang === 'ar' ? 'إغلاق' : lang === 'fr' ? 'Fermer' : 'Close'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Section 2: Detailed Explanation */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={`p-8 md:p-12 rounded-3xl border transition-all duration-500 shadow-xl ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 backdrop-blur-md' : 'bg-white/80 border-slate-200 backdrop-blur-md'}`}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
              {t.detailedExplanation.title}
            </h2>
            {showDetailedExplanation && (
              <button
                onClick={() => speak(`${t.detailedExplanation.content} ${t.detailedExplanation.sections.map(s => `${s.title}: ${s.content}`).join('. ')}`, lang)}
                className={`p-3 rounded-full transition-all ${isPlaying ? 'bg-emerald-500 text-white animate-pulse' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
              >
                <Activity className="w-6 h-6" />
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!showDetailedExplanation ? (
              <motion.div
                key="browse-btn-detailed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex justify-center py-8"
              >
                <motion.button
                  onClick={() => setShowDetailedExplanation(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95, y: 4 }}
                  className={`group flex items-center gap-3 px-10 py-5 rounded-2xl text-xl font-bold transition-all ${
                    theme === 'dark' 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_10px_0_rgba(16,185,129,0.3)]' 
                      : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_10px_0_rgba(16,185,129,0.3)]'
                  }`}
                >
                  <Search className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  {t.detailedExplanation.browse}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="content-detailed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <p className={`text-lg md:text-xl leading-relaxed mb-8 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t.detailedExplanation.content}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {t.detailedExplanation.sections.map((section, idx) => (
                    <div 
                      key={idx}
                      className={`p-6 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700 hover:border-blue-500/50' : 'bg-white border-slate-300 shadow-lg hover:shadow-xl hover:border-blue-500/50'}`}
                    >
                      <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-blue-500 flex items-center gap-3">
                          {section.title}
                        </h3>
                        
                        <AnimatePresence mode="wait">
                          {!openSubSections.includes(idx) ? (
                            <motion.div
                              key="browse-sub"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <button
                                onClick={() => toggleSubSection(idx)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                  theme === 'dark' 
                                    ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' 
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                }`}
                              >
                                <Search className="w-4 h-4" />
                                {t.detailedExplanation.browse}
                              </button>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="content-sub"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <p className={`text-sm md:text-base leading-relaxed mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                {section.content}
                              </p>
                              
                              {section.items && (
                                <ul className="space-y-3 mb-4">
                                  {section.items.map((item, i) => (
                                    <motion.li 
                                      key={i}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: i * 0.1 }}
                                      className="flex flex-col gap-2"
                                    >
                                      <button
                                        onClick={() => toggleItem(idx, i, item)}
                                        className={`flex items-start gap-3 text-start transition-all ${item.content ? 'hover:translate-x-1' : ''}`}
                                      >
                                        <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${openItems[idx] === i ? 'bg-blue-500' : 'bg-slate-400'}`} />
                                        <span className={`text-sm font-medium transition-colors ${openItems[idx] === i ? 'text-blue-500' : theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                                          {item.title}
                                        </span>
                                      </button>
                                      
                                      <AnimatePresence>
                                        {openItems[idx] === i && item.content && (
                                          <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden ms-5"
                                          >
                                            <p className={`text-xs md:text-sm leading-relaxed border-s-2 border-blue-500/30 ps-3 py-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                              {item.content}
                                            </p>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </motion.li>
                                  ))}
                                </ul>
                              )}

                              <button 
                                onClick={() => toggleSubSection(idx)}
                                className={`mt-3 text-xs font-bold flex items-center gap-1 transition-colors ${theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                              >
                                <X className="w-3 h-3" />
                                {lang === 'ar' ? 'إغلاق' : lang === 'fr' ? 'Fermer' : 'Close'}
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setShowDetailedExplanation(false)}
                  className={`mt-10 text-sm font-bold flex items-center gap-2 transition-colors ${theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <X className="w-4 h-4" />
                  {lang === 'ar' ? 'إغلاق' : lang === 'fr' ? 'Fermer' : 'Close'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Navigation to Page 2 */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex justify-center pt-8"
        >
          <button
            onClick={() => {
              setCurrentPage(2);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
              theme === 'dark' 
                ? 'bg-slate-800 text-blue-400 border border-slate-700 hover:bg-slate-700' 
                : 'bg-white text-blue-600 border border-slate-200 hover:bg-slate-50 shadow-lg'
            }`}
          >
            {t.detailedExplanation.nextPage}
            <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </button>
        </motion.div>
      </motion.div>
    ) : currentPage === 2 ? (
      <motion.div
        key="page-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-12"
      >
        <div className="text-center space-y-4 mb-12">
          <h2 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {t.pageTwo.title}
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.pageTwo.content}
          </p>
        </div>

        <PieChart3D t={t} theme={theme} isRtl={isRtl} lang={lang} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {t.pageTwo.sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => {
                setConfirmSection({ title: section.title, content: section.content, icon: section.icon });
              }}
              className={`p-8 rounded-[2rem] border transition-all cursor-pointer group card-3d ${
                theme === 'dark' 
                  ? 'bg-slate-800/40 border-slate-700 hover:border-blue-500/50' 
                  : 'bg-white border-slate-300 hover:border-blue-500 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]'
              }`}
            >
              <div className="flex flex-col gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  idx === 0 ? (theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600') :
                  idx === 1 ? (theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600') :
                  idx === 2 ? (theme === 'dark' ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600') :
                  (theme === 'dark' ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600')
                }`}>
                  {section.icon === 'cpu' && <Cpu className="w-8 h-8" />}
                  {section.icon === 'wifi' && <Wifi className="w-8 h-8" />}
                  {section.icon === 'cloud' && <Cloud className="w-8 h-8" />}
                  {section.icon === 'bot' && <Bot className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-bold group-hover:text-blue-500 transition-colors">
                  {section.title}
                </h3>
                {section.icon !== 'cpu' && section.icon !== 'wifi' && section.icon !== 'cloud' && section.icon !== 'bot' && (
                  <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {section.content}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Back to Page 1 and Next to Page 3 */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            whileTap={{ scale: 0.95, y: 4 }}
          >
            <button
              onClick={() => {
                setCurrentPage(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 shadow-lg'
              }`}
            >
              <ChevronRight className={`w-5 h-5 transition-transform group-hover:-translate-x-1 rotate-180 ${isRtl ? 'rotate-0 group-hover:translate-x-1' : ''}`} />
              {t.pageTwo.prevPage}
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            whileTap={{ scale: 0.95, y: 4 }}
          >
            <button
              onClick={() => {
                setCurrentPage(3);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-800 text-blue-400 border border-slate-700 hover:bg-slate-700' 
                  : 'bg-white text-blue-600 border border-slate-200 hover:bg-slate-50 shadow-lg'
              }`}
            >
              {t.pageTwo.nextPage}
              <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </button>
          </motion.div>
        </div>
      </motion.div>
    ) : currentPage === 3 ? (
      <motion.div
        key="page-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-12"
      >
        <div className="text-center space-y-4 mb-12">
          <h2 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {t.pageThree.title}
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.pageThree.content}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {t.pageThree.sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => {
                setConfirmSection({ 
                  title: section.title, 
                  content: section.moreInfo || section.content, 
                  icon: section.icon 
                });
              }}
              className={`p-8 rounded-[2rem] border transition-all cursor-pointer group card-3d ${
                theme === 'dark' 
                  ? 'bg-slate-800/40 border-slate-700 hover:border-blue-500/50' 
                  : 'bg-white border-slate-300 hover:border-blue-500 shadow-[0_10px_30_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]'
              }`}
            >
              <div className="flex flex-col gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  idx === 0 ? (theme === 'dark' ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600') : (theme === 'dark' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-50 text-yellow-600')
                }`}>
                  {section.icon === 'alert' && <AlertCircle className="w-8 h-8" />}
                  {section.icon === 'zap' && <Zap className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-bold group-hover:text-blue-500 transition-colors">
                  {section.title}
                </h3>
                <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {section.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Back to Page 2 and Next to Page 4 */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            whileTap={{ scale: 0.95, y: 4 }}
          >
            <button
              onClick={() => {
                setCurrentPage(2);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 shadow-lg'
              }`}
            >
              <ChevronRight className={`w-5 h-5 transition-transform group-hover:-translate-x-1 rotate-180 ${isRtl ? 'rotate-0 group-hover:translate-x-1' : ''}`} />
              {t.pageThree.prevPage}
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            whileTap={{ scale: 0.95, y: 4 }}
          >
            <button
              onClick={() => {
                setCurrentPage(4);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-800 text-blue-400 border border-slate-700 hover:bg-slate-700' 
                  : 'bg-white text-blue-600 border border-slate-200 hover:bg-slate-50 shadow-lg'
              }`}
            >
              {t.pageThree.nextPage}
              <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </button>
          </motion.div>
        </div>
      </motion.div>
    ) : currentPage === 4 ? (
      <motion.div
        key="page-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-12"
      >
        <div className="text-center space-y-4 mb-12">
          <h2 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {t.pageFour.title}
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.pageFour.content}
          </p>
        </div>

        <ArrowGraphic 
          items={t.pageFour.sections.map(s => s.title)} 
          isRtl={isRtl} 
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.pageFour.sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-8 rounded-[2rem] border transition-all card-3d ${
                theme === 'dark' 
                  ? 'bg-slate-800/40 border-slate-700' 
                  : 'bg-white border-slate-300 shadow-[0_10px_30px_rgba(0,0,0,0.08)]'
              }`}
            >
              <div className="flex flex-col gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  idx === 0 ? (theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600') :
                  idx === 1 ? (theme === 'dark' ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600') :
                  (theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600')
                }`}>
                  {section.icon === 'trending-up' && <TrendingUp className="w-8 h-8" />}
                  {section.icon === 'alert-triangle' && <AlertTriangle className="w-8 h-8" />}
                  {section.icon === 'activity' && <Activity className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-bold">
                  {section.title}
                </h3>
                <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {section.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Back to Page 3 and Next to Page 5 */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            whileTap={{ scale: 0.95, y: 4 }}
          >
            <button
              onClick={() => {
                setCurrentPage(3);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 shadow-lg'
              }`}
            >
              <ChevronRight className={`w-5 h-5 transition-transform group-hover:-translate-x-1 rotate-180 ${isRtl ? 'rotate-0 group-hover:translate-x-1' : ''}`} />
              {t.pageFour.prevPage}
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            whileTap={{ scale: 0.95, y: 4 }}
          >
            <button
              onClick={() => {
                setCurrentPage(5);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-800 text-blue-400 border border-slate-700 hover:bg-slate-700' 
                  : 'bg-white text-blue-600 border border-slate-200 hover:bg-slate-50 shadow-lg'
              }`}
            >
              {t.pageFour.nextPage}
              <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </button>
          </motion.div>
        </div>
      </motion.div>
    ) : currentPage === 5 ? (
      <motion.div
        key="page-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-12"
      >
        <div className="text-center space-y-4 mb-12">
          <h2 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {t.pageFive.title}
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.pageFive.content}
          </p>
        </div>

        <div className="max-w-4xl mx-auto aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/j3slknwUaI8?start=220"
            title={t.pageFive.videoTitle}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        {/* Navigation Back to Page 4 and Next to Page 6 */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            whileTap={{ scale: 0.95, y: 4 }}
          >
            <button
              onClick={() => {
                setCurrentPage(4);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 shadow-lg'
              }`}
            >
              <ChevronRight className={`w-5 h-5 transition-transform group-hover:-translate-x-1 rotate-180 ${isRtl ? 'rotate-0 group-hover:translate-x-1' : ''}`} />
              {t.pageFive.prevPage}
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            whileTap={{ scale: 0.95, y: 4 }}
          >
            <button
              onClick={() => {
                setCurrentPage(6);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
                theme === 'dark' 
                  ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_8px_0_rgb(29,78,216)] active:shadow-none' 
                  : 'bg-blue-500 text-white hover:bg-blue-400 shadow-[0_8px_0_rgb(37,99,235)] active:shadow-none'
              }`}
            >
              {t.pageFive.nextPage}
              <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </button>
          </motion.div>
        </div>
      </motion.div>
    ) : currentPage === 6 ? (
      <motion.div
        key="page-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-12"
      >
        <div className="text-center space-y-4 mb-12">
          <h2 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {t.pageSix.title}
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.pageSix.content}
          </p>
        </div>

        <BarChart3D t={t} theme={theme} />

        <div className="text-center space-y-4 mt-16 mb-8">
          <h2 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {t.pageSix.mapTitle}
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.pageSix.mapLegend}
          </p>
        </div>

        <WorldMap3D t={t} theme={theme} />

        <div className="text-center space-y-4 mt-16 mb-8">
          <h2 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {t.pageSix.frequencyTitle}
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.pageSix.frequencyLabel}
          </p>
        </div>

        <HorizontalBarChart3D t={t} theme={theme} isRtl={isRtl} />

        {/* Navigation */}
        <div className="flex items-center justify-center gap-8 pt-12">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            whileTap={{ scale: 0.95, y: 4 }}
          >
            <button
              onClick={() => {
                setCurrentPage(5);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 shadow-lg'
              }`}
            >
              <ChevronRight className={`w-5 h-5 transition-transform group-hover:-translate-x-1 rotate-180 ${isRtl ? 'rotate-0 group-hover:translate-x-1' : ''}`} />
              {t.pageSix.prevPage}
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            whileTap={{ scale: 0.95, y: 4 }}
          >
            <button
              onClick={() => {
                setCurrentPage(7);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
                theme === 'dark' 
                  ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_8px_0_rgb(29,78,216)] active:shadow-none' 
                  : 'bg-blue-500 text-white hover:bg-blue-400 shadow-[0_8px_0_rgb(37,99,235)] active:shadow-none'
              }`}
            >
              {t.pageSix.nextPage}
              <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </button>
          </motion.div>
        </div>
      </motion.div>
    ) : currentPage === 7 ? (
      <motion.div
        key="page-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-16"
      >
        <div className="text-center space-y-4 mb-12">
          <h2 className={`text-5xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {t.pageSeven.title}
          </h2>
          <div className="w-32 h-2 bg-blue-500 mx-auto mt-6 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* What we know */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            onClick={() => setZoomedConclusion(zoomedConclusion === 'know' ? null : 'know')}
            className={`p-10 rounded-[3rem] border relative overflow-hidden card-3d cursor-pointer transition-all duration-500 ${
              zoomedConclusion === 'know' ? 'ring-4 ring-emerald-500/50 scale-[1.02] z-20' : 'z-10'
            } ${
              theme === 'dark' 
                ? 'bg-slate-800/40 border-slate-700' 
                : 'bg-white border-slate-300 shadow-[0_20px_50px_rgba(0,0,0,0.1)]'
            }`}
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Zap className="w-10 h-10" />
              </div>
              <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                {t.pageSeven.whatWeKnowTitle}
              </h3>
            </div>
            <motion.p 
              animate={{ 
                scale: zoomedConclusion === 'know' ? 1.15 : 1,
                originX: isRtl ? 1 : 0
              }}
              className={`text-xl leading-relaxed font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}
            >
              {t.pageSeven.whatWeKnowContent}
            </motion.p>
          </motion.div>

          {/* What remains */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            onClick={() => setZoomedConclusion(zoomedConclusion === 'remains' ? null : 'remains')}
            className={`p-10 rounded-[3rem] border relative overflow-hidden card-3d cursor-pointer transition-all duration-500 ${
              zoomedConclusion === 'remains' ? 'ring-4 ring-amber-500/50 scale-[1.02] z-20' : 'z-10'
            } ${
              theme === 'dark' 
                ? 'bg-slate-800/40 border-slate-700' 
                : 'bg-white border-slate-300 shadow-[0_20px_50px_rgba(0,0,0,0.1)]'
            }`}
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-amber-500" />
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <TrendingUp className="w-10 h-10" />
              </div>
              <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                {t.pageSeven.whatRemainsTitle}
              </h3>
            </div>
            <motion.p 
              animate={{ 
                scale: zoomedConclusion === 'remains' ? 1.15 : 1,
                originX: isRtl ? 1 : 0
              }}
              className={`text-xl leading-relaxed font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}
            >
              {t.pageSeven.whatRemainsContent}
            </motion.p>
          </motion.div>
        </div>

        {/* Navigation Back to Page 6 */}
        <div className="flex items-center justify-center gap-8 pt-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            whileTap={{ scale: 0.95, y: 4 }}
          >
            <button
              onClick={() => {
                setCurrentPage(6);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 shadow-lg'
              }`}
            >
              <ChevronRight className={`w-5 h-5 transition-transform group-hover:-translate-x-1 rotate-180 ${isRtl ? 'rotate-0 group-hover:translate-x-1' : ''}`} />
              {t.pageSeven.prevPage}
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            whileTap={{ scale: 0.95, y: 4 }}
          >
            <button
              onClick={() => {
                setCurrentPage(8);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
                theme === 'dark' 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_8px_0_rgb(5,150,105)] active:shadow-none' 
                  : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-[0_8px_0_rgb(16,185,129)] active:shadow-none'
              }`}
            >
              {t.pageSeven.nextPage}
              <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </button>
          </motion.div>
        </div>
      </motion.div>
    ) : currentPage === 8 ? (
      <motion.div
        key="page-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-12"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
          className="w-32 h-32 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-8"
        >
          <ShieldCheck className="w-20 h-20" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className={`text-7xl md:text-9xl font-black tracking-tighter ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
        >
          {t.pageEight.thankYou}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="max-w-3xl"
        >
          <p className={`text-2xl md:text-4xl font-bold leading-tight ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {t.pageEight.message}
          </p>
        </motion.div>

        {/* 3D Credits Section */}
        <motion.div
          initial={{ opacity: 0, rotateX: 90, y: 100 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ 
            delay: 1.8, 
            duration: 1.2,
            type: "spring",
            stiffness: 100
          }}
          style={{ perspective: 1000 }}
          className="pt-16"
        >
          <div className={`p-8 rounded-[2rem] border-2 border-dashed ${
            theme === 'dark' 
              ? 'bg-slate-800/50 border-slate-700' 
              : 'bg-white border-slate-200 shadow-xl'
          } card-3d`}>
            <p className={`text-lg font-bold mb-4 uppercase tracking-widest ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
            }`}>
              {t.pageEight.presentedBy}
            </p>
            <h3 className={`text-3xl md:text-5xl font-black ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              {t.pageEight.names}
            </h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="pt-12"
        >
          <button
            onClick={() => {
              setCurrentPage(7);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
              theme === 'dark' 
                ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 shadow-lg'
            }`}
          >
            <ChevronRight className={`w-5 h-5 transition-transform group-hover:-translate-x-1 rotate-180 ${isRtl ? 'rotate-0 group-hover:translate-x-1' : ''}`} />
            {t.pageEight.prevPage}
          </button>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.2, 0],
                scale: [0, 1.5, 0],
                x: Math.random() * 1000 - 500,
                y: Math.random() * 1000 - 500
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5
              }}
              className="absolute left-1/2 top-1/2 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"
            />
          ))}
        </div>
      </motion.div>
    ) : null}
  </AnimatePresence>
</main>

      {/* Footer */}
      <footer className={`py-12 px-6 text-center transition-colors duration-500 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
        <p className="text-sm">
          &copy; 2026 Flash Flood Prediction Review. Simplified Edition.
        </p>
      </footer>
    </div>
  );
}
