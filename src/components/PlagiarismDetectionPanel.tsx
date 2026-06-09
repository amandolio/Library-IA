import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, FileText, Search, BarChart3, Globe, Eye, Brain, Database, ExternalLink, Copy, Layers, EggFried as Verified, AlertCircle, BookOpen, Upload, X, History, Server, Trash2, Clock, Fingerprint, Zap, Target, TrendingUp, PieChart, FileWarning, MessageSquareText, Link2, LayoutGrid as Layout, Table2, FlaskConical, UserX } from 'lucide-react';
import { advancedPlagiarismDetector, PlagiarismReport, PlagiarismMatch, PlagiarismType } from '../services/advancedPlagiarismDetector';
import { createClient } from '@supabase/supabase-js';

interface SourceDocument {
  id: string;
  title: string;
  author: string;
  year: number;
  content: string;
  url?: string;
  doi?: string;
  language: string;
  type: 'academic' | 'book' | 'web' | 'journal';
}

interface RepoStatus {
  name: string;
  status: 'pending' | 'ok' | 'error';
  count: number;
  latencyMs?: number;
}

const sourceDocuments: SourceDocument[] = [
  // ==================== INTELIGENCIA ARTIFICIAL Y MACHINE LEARNING ====================
  {
    id: 'aiml-001',
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell, Peter Norvig',
    year: 2021,
    content: 'Artificial intelligence is the field of computer science dedicated to creating systems capable of performing tasks that typically require human intelligence. These tasks include learning, reasoning, problem-solving, perception, and language understanding. Modern AI systems leverage machine learning techniques, particularly deep neural networks, to learn hierarchical representations from data. The field encompasses knowledge representation, automated planning, natural language processing, computer vision, and robotics.',
    url: 'https://aima.cs.berkeley.edu/',
    doi: '10.1145/3454347',
    language: 'en',
    type: 'book'
  },
  {
    id: 'aiml-002',
    title: 'Deep Learning',
    author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
    year: 2016,
    content: 'Deep learning is a subset of machine learning that uses artificial neural networks with multiple layers to progressively extract higher-level features from raw input. For image processing, lower layers may identify edges, while higher layers identify concepts relevant to human interpretation such as digits, letters, or faces. Deep learning excels at discovering intricate structures in large datasets through backpropagation, which instructs how each parameter should be adjusted to reduce error.',
    url: 'https://www.deeplearningbook.org/',
    doi: '10.1038/nature14539',
    language: 'en',
    type: 'book'
  },
  {
    id: 'aiml-003',
    title: 'Pattern Recognition and Machine Learning',
    author: 'Christopher Bishop',
    year: 2006,
    content: 'Machine learning is a scientific discipline that explores the construction and study of algorithms that can learn from data. Such algorithms operate by building a model from example inputs in order to make data-driven predictions or decisions, rather than following strictly static program instructions. Pattern recognition focuses on the automatic discovery of patterns in data through statistical analysis.',
    url: 'https://www.microsoft.com/en-us/research/people/cmbishop/',
    doi: '10.1007/978-0-387-45528-0',
    language: 'en',
    type: 'book'
  },
  {
    id: 'aiml-004',
    title: 'Attention Is All You Need',
    author: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit',
    year: 2017,
    content: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Self-attention allows the model to weigh the importance of different words in a sequence when making predictions.',
    url: 'https://arxiv.org/abs/1706.03762',
    doi: '10.48550/arXiv.1706.03762',
    language: 'en',
    type: 'academic'
  },
  {
    id: 'aiml-005',
    title: 'ImageNet Classification with Deep Convolutional Neural Networks',
    author: 'Alex Krizhevsky, Ilya Sutskever, Geoffrey Hinton',
    year: 2012,
    content: 'We trained a large, deep convolutional neural network to classify the 1.2 million high-resolution images in the ImageNet LSVRC-2010 contest into 1000 different classes. The neural network has 60 million parameters and 650,000 neurons, consists of five convolutional layers, some followed by max-pooling layers, and three fully-connected layers with a final 1000-way softmax. This AlexNet architecture achieved top-1 and top-5 error rates significantly better than previous state-of-the-art.',
    url: 'https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html',
    doi: '10.1145/3065386',
    language: 'en',
    type: 'academic'
  },
  {
    id: 'aiml-006',
    title: 'Generative Adversarial Networks',
    author: 'Ian Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu',
    year: 2014,
    content: 'We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G. The training procedure for G is to maximize the probability of D making a mistake. This framework can produce sharp, realistic images and has become foundational for generative AI.',
    url: 'https://arxiv.org/abs/1406.2661',
    doi: '10.48550/arXiv.1406.2661',
    language: 'en',
    type: 'academic'
  },
  {
    id: 'aiml-007',
    title: 'Bert: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    author: 'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova',
    year: 2019,
    content: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers. As a result, the pre-trained BERT model can be fine-tuned with just one additional output layer to create state-of-the-art models for a wide range of NLP tasks.',
    url: 'https://arxiv.org/abs/1810.04805',
    doi: '10.18653/v1/N19-1423',
    language: 'en',
    type: 'academic'
  },
  {
    id: 'aiml-008',
    title: 'Playing Atari with Deep Reinforcement Learning',
    author: 'Volodymyr Mnih, Koray Kavukcuoglu, David Silver, Alex Graves',
    year: 2013,
    content: 'We present the first deep learning model to successfully learn control policies directly from high-dimensional sensory input using reinforcement learning. The model is a convolutional neural network, trained with a variant of Q-learning, whose input is raw pixels and whose output is a value function estimating future rewards. We apply our method to seven Atari 2600 games from the Arcade Learning Environment, with no adjustment of the architecture or learning algorithm.',
    url: 'https://arxiv.org/abs/1312.5602',
    doi: '10.48550/arXiv.1312.5602',
    language: 'en',
    type: 'academic'
  },
  {
    id: 'aiml-009',
    title: 'GPT-4 Technical Report',
    author: 'OpenAI',
    year: 2023,
    content: 'We report the development of GPT-4, a large-scale multimodal model capable of processing image and text inputs and producing text outputs. Although less capable than humans in many real-world scenarios, GPT-4 exhibits human-level performance on various professional and academic benchmarks, including passing a simulated bar exam with a score around the top 10% of test-takers. The model uses a Transformer architecture with improved training stability and predictability.',
    url: 'https://arxiv.org/abs/2303.08774',
    doi: '10.48550/arXiv.2303.08774',
    language: 'en',
    type: 'academic'
  },
  {
    id: 'aiml-010',
    title: 'ResNet: Deep Residual Learning for Image Recognition',
    author: 'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun',
    year: 2016,
    content: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions. We provide comprehensive empirical evidence showing that these residual networks are easier to optimize, and can gain accuracy from considerably increased depth.',
    url: 'https://arxiv.org/abs/1512.03385',
    doi: '10.1109/CVPR.2016.90',
    language: 'en',
    type: 'academic'
  },
  {
    id: 'aiml-011',
    title: 'Dropout: A Simple Way to Prevent Neural Networks from Overfitting',
    author: 'Nitish Srivastava, Geoffrey Hinton, Alex Krizhevsky, Ilya Sutskever',
    year: 2014,
    content: 'Deep neural nets with a large number of parameters are very powerful machine learning systems. However, overfitting is a serious problem in such networks. We propose dropout, where we drop units randomly during training to prevent co-adaptation of feature detectors. Dropout significantly improves the performance of neural networks on supervised learning tasks in vision, speech recognition, document classification, and computational biology.',
    url: 'https://jmlr.org/papers/v15/srivastava14a.html',
    doi: '10.5555/2627435.2670313',
    language: 'en',
    type: 'academic'
  },
  {
    id: 'aiml-012',
    title: 'Adam: A Method for Stochastic Optimization',
    author: 'Diederik Kingma, Jimmy Ba',
    year: 2015,
    content: 'We introduce Adam, an algorithm for first-order gradient-based optimization of stochastic objective functions, based on adaptive estimates of lower-order moments. The method is straightforward to implement, computationally efficient, has little memory requirements, and is well suited for problems that are large in terms of data or parameters. Adam combines the advantages of AdaGrad and RMSProp and has become the default optimizer for deep learning.',
    url: 'https://arxiv.org/abs/1412.6980',
    doi: '10.48550/arXiv.1412.6980',
    language: 'en',
    type: 'academic'
  },
  // ==================== PROGRAMACIÓN Y DESARROLLO ====================
  {
    id: 'prog-001',
    title: 'The C Programming Language',
    author: 'Brian Kernighan, Dennis Ritchie',
    year: 1988,
    content: 'C is a general-purpose programming language which features economy of expression, modern control flow and data structures, and a rich set of operators. C is not a very high level language, nor is it a big one, and is not specialized to any particular area of application. But its absence of restrictions and its generality make it more convenient and effective for many tasks than supposedly more powerful languages.',
    url: 'https://www.bell-labs.com/usr/dmr/www/cbook.html',
    doi: '10.5555/109517',
    language: 'en',
    type: 'book'
  },
  {
    id: 'prog-002',
    title: 'Structure and Interpretation of Computer Programs',
    author: 'Harold Abelson, Gerald Jay Sussman',
    year: 1996,
    content: 'A computer language is not just a way of getting a computer to perform operations but is a novel formal medium for expressing ideas about methodology. Thus, programs must be written for people to read, and only incidentally for machines to execute. We believe that the essential material to be addressed by a subject at this level is not the syntax of particular programming-language constructs but rather the techniques used to control the intellectual complexity of large software systems.',
    url: 'https://mitpress.mit.edu/sites/default/files/sicp/index.html',
    doi: '10.5555/291481',
    language: 'en',
    type: 'book'
  },
  {
    id: 'prog-003',
    title: 'The Pragmatic Programmer: Your Journey to Mastery',
    author: 'David Thomas, Andrew Hunt',
    year: 2019,
    content: 'Programming is a craft. A programmer is like a skilled carpenter, using tools and techniques to shape raw materials into useful objects. Good programming is not learned from generalities, but from seeing how good programmers do things and from experimenting with their techniques. The pragmatic programmer takes responsibility for their work, communicates clearly, and continuously improves their craft through deliberate practice.',
    url: 'https://pragprog.com/titles/tpp20/',
    doi: '10.5555/3376219',
    language: 'en',
    type: 'book'
  },
  {
    id: 'prog-004',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    year: 2008,
    content: 'Even bad code can function. But if code is not clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it does not have to be that way. Clean code is code that has been taken care of, code that has been crafted with attention, code that someone has cared about. Clean code is focused, each function does one thing well, and names reveal intention.',
    url: 'https://www.oreilly.com/library/view/clean-code-a/9780136083238/',
    doi: '10.5555/1534519',
    language: 'en',
    type: 'book'
  },
  {
    id: 'prog-005',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    year: 1994,
    content: 'Design patterns are reusable solutions to commonly occurring problems in software design. They represent best practices evolved over time by experienced software developers. Patterns are about design at a higher level of abstraction than classes. They categorize object-oriented techniques into creational, structural, and behavioral patterns. The Observer, Strategy, and Factory patterns are among the most widely used in modern software architecture.',
    url: 'https://books.google.com/books?id=6oHuKQe3TjQC',
    doi: '10.5555/186897',
    language: 'en',
    type: 'book'
  },
  {
    id: 'prog-006',
    title: 'Refactoring: Improving the Design of Existing Code',
    author: 'Martin Fowler',
    year: 2018,
    content: 'Refactoring is the process of changing a software system in such a way that it does not alter the external behavior of the code yet improves its internal structure. It is a disciplined way to clean up code that minimizes the chances of introducing bugs. In essence, when you refactor, you improve the design of the code after it has been written. Refactoring makes code easier to understand and modify, which is essential for maintainable software.',
    url: 'https://martinfowler.com/books/refactoring.html',
    doi: '10.5555/3200593',
    language: 'en',
    type: 'book'
  },
  {
    id: 'prog-007',
    title: 'The Mythical Man-Month: Essays on Software Engineering',
    author: 'Frederick Brooks',
    year: 1975,
    content: 'Adding manpower to a late software project makes it later. This is Brooks Law, derived from the observation that new programmers need time to be trained in the project and that communication overhead increases quadratically with the number of developers. The fundamental problem is that software development is inherently complex, and no silver bullet will magically make it significantly easier. Conceptual integrity is the most important consideration in system design.',
    url: 'https://archive.org/details/mythicalmanmonth00fred',
    doi: '10.5555/207871',
    language: 'en',
    type: 'book'
  },
  {
    id: 'prog-008',
    title: 'JavaScript: The Good Parts',
    author: 'Douglas Crockford',
    year: 2008,
    content: 'JavaScript has a surprisingly large number of good ideas and bad ideas mixed together. The good ideas include functions, loose typing, dynamic objects, and an expressive object literal notation. The bad ideas include a programming model based on global variables and insufficient type checking. Most programming languages contain good and bad parts, but JavaScript has more than its share of bad parts. The key is to learn to avoid the bad parts.',
    url: 'https://www.oreilly.com/library/view/javascript-the-good/9780596517748/',
    doi: '10.5555/1402357',
    language: 'en',
    type: 'book'
  },
  {
    id: 'prog-009',
    title: 'Effective Java',
    author: 'Joshua Bloch',
    year: 2018,
    content: 'Java is a powerful programming language and platform, but it has its traps and pitfalls. This book provides best practices for the Java programming language and its core libraries. Effective Java programming consists of knowing when to use each language feature and how to combine them effectively. Items cover creating and destroying objects, methods common to all objects, generics, enums, lambdas, streams, exceptions, and concurrency.',
    url: 'https://www.oreilly.com/library/view/effective-java/9780134686097/',
    doi: '10.5555/3325878',
    language: 'en',
    type: 'book'
  },
  {
    id: 'prog-010',
    title: 'Python Crash Course: A Hands-On, Project-Based Introduction to Programming',
    author: 'Eric Matthes',
    year: 2019,
    content: 'Python is a great first programming language because of its clear and readable syntax. Python code reads almost like English, which makes it easier to learn and write. The language emphasizes code readability and allows expressing concepts in fewer lines of code than languages like C++ or Java. Python supports multiple programming paradigms including procedural, object-oriented, and functional programming, making it versatile for many types of applications.',
    url: 'https://nostarch.com/pythoncrashcourse2e',
    doi: '10.5555/3303698',
    language: 'en',
    type: 'book'
  },
  // ==================== CIENCIA DE DATOS Y ANALYTICS ====================
  {
    id: 'data-001',
    title: 'The Elements of Statistical Learning: Data Mining, Inference, and Prediction',
    author: 'Trevor Hastie, Robert Tibshirani, Jerome Friedman',
    year: 2009,
    content: 'Data mining is the extraction of implicit, previously unknown, and potentially useful information from data. Machine learning provides the technical basis for data mining. The goal is to develop algorithms that automatically build models from data and then use those models for prediction and decision making. Statistical learning theory provides a framework for understanding the tradeoff between model complexity and generalization performance.',
    url: 'https://hastie.su.domains/ElemStatLearn/',
    doi: '10.1007/978-0-387-84858-7',
    language: 'en',
    type: 'book'
  },
  {
    id: 'data-002',
    title: 'Python for Data Analysis',
    author: 'Wes McKinney',
    year: 2022,
    content: 'Data science is an interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge and insights from structured and unstructured data. Data wrangling is the process of transforming and mapping raw data into another format for appropriate integration and analysis. Pandas provides data structures and tools for working with structured data, enabling filtering, transforming, aggregating, and reshaping operations.',
    url: 'https://wesmckinney.com/book/',
    doi: '10.5555/3376350',
    language: 'en',
    type: 'book'
  },
  {
    id: 'data-003',
    title: 'R for Data Science',
    author: 'Hadley Wickham, Garrett Grolemund',
    year: 2017,
    content: 'Data science is the discipline of making data useful. It involves importing, tidying, transforming, visualizing, and modeling data. The tidyverse is a collection of R packages designed for data science with a common philosophy: data structures, APIs, and design principles that work together harmoniously. Tidy data has variables in columns, observations in rows, and values in cells, which enables consistent manipulation and visualization.',
    url: 'https://r4ds.had.co.nz/',
    doi: '10.5555/3161349',
    language: 'en',
    type: 'book'
  },
  {
    id: 'data-004',
    title: 'Data Science from Scratch: First Principles with Python',
    author: 'Joel Grus',
    year: 2019,
    content: 'To really learn data science, you should not just use libraries and frameworks but understand how they work by implementing them from scratch. This approach builds foundational knowledge of statistics, linear algebra, probability, and computer science concepts that underlie all data science. Machine learning is essentially teaching computers to make predictions or decisions based on patterns in data, without explicit programming for each scenario.',
    url: 'https://www.oreilly.com/library/view/data-science-from/9781492041142/',
    doi: '10.5555/3347054',
    language: 'en',
    type: 'book'
  },
  {
    id: 'data-005',
    title: 'Statistics for Business and Economics',
    author: 'James McClave, P. George Benson, Terry Sincich',
    year: 2018,
    content: 'Statistics is the science of data. It involves collecting, classifying, summarizing, organizing, analyzing, and interpreting numerical information. Descriptive statistics uses graphical and numerical methods to summarize and present data. Inferential statistics uses sample data to make inferences about a population. The central limit theorem establishes that the sampling distribution of the mean approximates a normal distribution as sample size increases.',
    url: 'https://www.pearson.com/store/p/statistics-for-business-and-economics/',
    doi: '10.5555/3430998',
    language: 'en',
    type: 'book'
  },
  {
    id: 'data-006',
    title: 'Big Data: A Revolution That Will Transform How We Live, Work, and Think',
    author: 'Viktor Mayer-Schonberger, Kenneth Cukier',
    year: 2013,
    content: 'Big data refers to the ability of society to harness information in new ways to produce useful insights or goods and services of significant value. The three Vs characterize big data: volume, velocity, and variety. The emergence of big data challenges traditional notions of privacy, consent, and the relationship between causality and correlation. Datafication transforms aspects of life that were never before quantified into data that can be analyzed.',
    url: 'https://books.google.com/books?id=JfKfAAAAQBAJ',
    doi: '10.5555/2514935',
    language: 'en',
    type: 'book'
  },
  {
    id: 'data-007',
    title: 'Storytelling with Data: A Data Visualization Guide for Business Professionals',
    author: 'Cole Nussbaumer Knaflic',
    year: 2015,
    content: 'Effective data visualization is about communicating data clearly and efficiently. The goal is to make the data easy to understand and the insights actionable. Visual perception principles guide how humans interpret graphical representations. Choosing the right chart type, using color strategically, eliminating clutter, and focusing attention on the key takeaways are fundamental skills for data storytelling in business and research contexts.',
    url: 'https://www.storytellingwithdata.com/',
    doi: '10.1002/9781119055251',
    language: 'en',
    type: 'book'
  },
  {
    id: 'data-008',
    title: 'Introduction to Information Retrieval',
    author: 'Christopher Manning, Prabhakar Raghavan, Hinrich Schutze',
    year: 2008,
    content: 'Information retrieval is the process of obtaining relevant documents in response to user queries. Modern search engines use inverted indices to map terms to the documents containing them. Ranking algorithms determine the order of search results based on relevance scores computed from term frequency, inverse document frequency (TF-IDF), and document length. The web graph structure, as exploited by PageRank, provides additional signals about document importance.',
    url: 'https://nlp.stanford.edu/IR-book/',
    doi: '10.1017/CBO9780511809071',
    language: 'en',
    type: 'book'
  },
  // ==================== CIBERSEGURIDAD Y CRIPTOGRAFIA ====================
  {
    id: 'cyber-001',
    title: 'Computer Security: Principles and Practice',
    author: 'William Stallings, Lawrie Brown',
    year: 2022,
    content: 'Computer security is the protection of computer systems from theft, damage to hardware or software, and disruption or misdirection of the services they provide. It involves confidentiality, integrity, and availability, known as the CIA triad. Security threats include malware, intruders, insider abuse, criminal enterprises, and state-sponsored actors. Defense mechanisms encompass authentication, access control, intrusion detection, and cryptography.',
    url: 'https://www.pearson.com/store/p/computer-security-principles-and-practice/',
    doi: '10.5555/3525943',
    language: 'en',
    type: 'book'
  },
  {
    id: 'cyber-002',
    title: 'Applied Cryptography: Protocols, Algorithms, and Source Code in C',
    author: 'Bruce Schneier',
    year: 1996,
    content: 'Cryptography is the fundamental technology underlying most computer security. Symmetric encryption uses the same key for encryption and decryption, while asymmetric encryption uses a key pair: a public key for encryption and a private key for decryption. Hash functions map arbitrary-length inputs to fixed-length outputs and are essential for digital signatures and password storage. Protocols must be designed to resist known attack models including chosen plaintext and man-in-the-middle attacks.',
    url: 'https://www.schneier.com/books/applied_cryptography/',
    doi: '10.5555/236269',
    language: 'en',
    type: 'book'
  },
  {
    id: 'cyber-003',
    title: 'Security Engineering: A Guide to Building Dependable Distributed Systems',
    author: 'Ross Anderson',
    year: 2020,
    content: 'Security engineering is about building systems that remain dependable in the face of malice, error, or mischance. It focuses on the design and implementation of systems that maintain properties like confidentiality, integrity, and availability despite hostile actions. The security mindset requires thinking about how things can fail and how attackers might abuse features. Threat modeling identifies potential attack vectors and prioritizes defensive measures based on risk.',
    url: 'https://www.cl.cam.ac.uk/~rja14/book.html',
    doi: '10.5555/236269',
    language: 'en',
    type: 'book'
  },
  {
    id: 'cyber-004',
    title: 'The Art of Software Security Assessment',
    author: 'Mark Dowd, John McDonald, Justin Schuh',
    year: 2006,
    content: 'Software security assessment is the process of analyzing software to find vulnerabilities that could be exploited by attackers. It includes code review, architecture analysis, and penetration testing. Common vulnerability classes include buffer overflows, integer issues, format string bugs, and race conditions. Understanding how software exploits work is essential for building defensive mechanisms and writing secure code.',
    url: 'https://www.oreilly.com/library/view/the-art-of/0321441904/',
    doi: '10.5555/1209298',
    language: 'en',
    type: 'book'
  },
  {
    id: 'cyber-005',
    title: 'Hacking: The Art of Exploitation',
    author: 'Jon Erickson',
    year: 2008,
    content: 'Exploitation is the art of making software programs do unexpected things. Buffer overflow vulnerabilities occur when input exceeds the bounds of a buffer and overwrites adjacent memory, potentially allowing execution of arbitrary code. Shellcode is machine code designed to give an attacker a command shell on the target system. Understanding low-level programming, computer architecture, and exploit mitigation techniques is essential for both attackers and defenders.',
    url: 'https://nostarch.com/hacking2.htm',
    doi: '10.5555/1404395',
    language: 'en',
    type: 'book'
  },
  {
    id: 'cyber-006',
    title: 'Metasploit: The Penetration Testers Guide',
    author: 'David Kennedy, Jim O Gorman, Devon Kearns',
    year: 2011,
    content: 'Penetration testing is the practice of testing a computer system, network, or web application to find vulnerabilities that an attacker could exploit. The Metasploit framework provides tools for developing and executing exploit code against remote targets. Reconnaissance, scanning, exploitation, and post-exploitation are the phases of a penetration test. Professional pentesters follow rules of engagement and document findings for remediation.',
    url: 'https://nostarch.com/metasploit',
    doi: '10.5555/2023851',
    language: 'en',
    type: 'book'
  },
  {
    id: 'cyber-007',
    title: 'Network Security Essentials: Applications and Standards',
    author: 'William Stallings',
    year: 2017,
    content: 'Network security encompasses measures to protect data during transmission and to protect the network infrastructure itself. Firewalls control traffic flow between network segments based on security policies. Virtual private networks use encryption to create secure tunnels over public networks. Network intrusion detection systems monitor traffic for signs of malicious activity. TLS/SSL protocols provide secure communication for web applications and other services.',
    url: 'https://www.pearson.com/store/p/network-security-essentials/',
    doi: '10.5555/2514935',
    language: 'en',
    type: 'book'
  },
  {
    id: 'cyber-008',
    title: 'OWASP Testing Guide v4',
    author: 'OWASP Foundation',
    year: 2014,
    content: 'Web application security testing is the process of analyzing web applications to identify security vulnerabilities. The Open Web Application Security Project maintains a guide covering information gathering, configuration management, identity management, authentication, authorization, session management, input validation, and error handling. Common web vulnerabilities include injection flaws, broken authentication, sensitive data exposure, and cross-site scripting.',
    url: 'https://owasp.org/www-project-web-security-testing-guide/',
    doi: '10.13140/2.1.4685.5043',
    language: 'en',
    type: 'web'
  },
  // ==================== SISTEMAS Y REDES ====================
  {
    id: 'sys-001',
    title: 'Operating System Concepts',
    author: 'Abraham Silberschatz, Peter Galvin, Greg Gagne',
    year: 2018,
    content: 'An operating system is system software that manages computer hardware and software resources and provides common services for computer programs. The OS acts as an intermediary between users and hardware, managing processes, memory, storage, and I/O devices. Process scheduling algorithms determine which process runs at any given time. Memory management includes paging, segmentation, and virtual memory to efficiently allocate limited physical memory among multiple processes.',
    url: 'https://www.os-book.com/',
    doi: '10.5555/2636518',
    language: 'en',
    type: 'book'
  },
  {
    id: 'sys-002',
    title: 'Computer Networks',
    author: 'Andrew Tanenbaum, David Wetherall',
    year: 2011,
    content: 'A computer network is a set of computers connected together for the purpose of sharing resources. The OSI reference model divides networking into seven layers: physical, data link, network, transport, session, presentation, and application. TCP/IP is the dominant protocol suite for the Internet, providing reliable data transmission through IP addressing, TCP connections, and application protocols like HTTP, FTP, and SMTP.',
    url: 'https://www.pearson.com/store/p/computer-networks/',
    doi: '10.5555/1974544',
    language: 'en',
    type: 'book'
  },
  {
    id: 'sys-003',
    title: 'Computer Systems: A Programmers Perspective',
    author: 'Randal Bryant, David OHallaron',
    year: 2015,
    content: 'Understanding how computer systems execute programs, store information, and communicate enables programmers to write more efficient and reliable code. The processor executes machine-level instructions generated by compilers from source code. Assembly language provides a human-readable representation of machine code. Virtual memory gives each process the illusion of having exclusive use of the main memory, while the operating system manages actual physical memory allocation.',
    url: 'https://csapp.cs.cmu.edu/',
    doi: '10.5555/2773144',
    language: 'en',
    type: 'book'
  },
  {
    id: 'sys-004',
    title: 'Distributed Systems: Principles and Paradigms',
    author: 'Andrew Tanenbaum, Maarten Van Steen',
    year: 2017,
    content: 'A distributed system is a collection of independent computers that appears to its users as a single coherent system. Key challenges include transparency, scalability, reliability, and security. Interprocess communication, coordination, consistency, and replication are fundamental concerns. Cloud computing platforms provide on-demand access to computing resources over the network, enabling elastic scaling and pay-per-use billing models.',
    url: 'https://www.distributed-systems.net/',
    doi: '10.5555/1205990',
    language: 'en',
    type: 'book'
  },
  {
    id: 'sys-005',
    title: 'Modern Operating Systems',
    author: 'Andrew Tanenbaum',
    year: 2014,
    content: 'Modern operating systems must handle multiprogramming, virtual memory, file systems, and networking. Process concepts include creation, termination, states, scheduling, and interprocess communication. File systems organize persistent storage with directories, file allocation tables, and journaling for crash recovery. Device drivers provide standardized interfaces for hardware I/O. Multithreading enables concurrent execution within a single process address space.',
    url: 'https://www.pearson.com/store/p/modern-operating-systems/',
    doi: '10.5555/2505696',
    language: 'en',
    type: 'book'
  },
  {
    id: 'sys-006',
    title: 'TCP/IP Illustrated, Volume 1: The Protocols',
    author: 'W. Richard Stevens',
    year: 1994,
    content: 'TCP/IP forms the foundation of Internet communications. IP provides unreliable, connectionless packet delivery through routing algorithms that determine the best path between networks. TCP adds reliable, connection-oriented data delivery with flow control and congestion control mechanisms. UDP provides a simple, unreliable datagram service for applications that prefer speed over reliability. Understanding these protocols is essential for network programming and troubleshooting.',
    url: 'https://www.oreilly.com/library/view/tcpip-illustrated-volume/9780132808575/',
    doi: '10.5555/179163',
    language: 'en',
    type: 'book'
  },
  {
    id: 'sys-007',
    title: 'Linux System Programming: Talking Directly to the Kernel and C Library',
    author: 'Robert Love',
    year: 2013,
    content: 'System programming involves writing software that provides services to other software or directly interfaces with hardware. Linux system calls provide the interface between user programs and the kernel. File I/O operations use open, read, write, and close system calls. Process management includes fork, exec, and wait for creating and controlling child processes. Memory mapping enables efficient file access and shared memory between processes.',
    url: 'https://www.oreilly.com/library/view/linux-system-programming/9781449341598/',
    doi: '10.5555/2505696',
    language: 'en',
    type: 'book'
  },
  {
    id: 'sys-008',
    title: 'Site Reliability Engineering: How Google Runs Production Systems',
    author: 'Betsy Beyer, Chris Jones, Jennifer Petoff, Niall Murphy',
    year: 2016,
    content: 'Site reliability engineering applies software engineering principles to operations problems to create scalable and highly reliable software systems. SREs focus on automation, monitoring, incident response, and change management. Service level objectives define target reliability, while error budgets balance innovation with stability. Incident management processes minimize downtime and enable continuous improvement through blameless postmortems.',
    url: 'https://sre.google/sre-book/',
    doi: '10.5555/3031449',
    language: 'en',
    type: 'book'
  },
  // ==================== BASES DE DATOS ====================
  {
    id: 'db-001',
    title: 'Database System Concepts',
    author: 'Abraham Silberschatz, Henry Korth, S. Sudarshan',
    year: 2019,
    content: 'A database is a collection of interrelated data and a set of programs to access that data. The database management system provides an environment that is convenient and efficient to use. Data models define how data is logically organized. The relational model represents data as tables with rows and columns. SQL is the standard language for querying and manipulating relational databases. Normalization eliminates redundancy and dependency problems through decomposition.',
    url: 'https://www.db-book.com/',
    doi: '10.5555/3337923',
    language: 'en',
    type: 'book'
  },
  {
    id: 'db-002',
    title: 'Database Management Systems',
    author: 'Raghu Ramakrishnan, Johannes Gehrke',
    year: 2003,
    content: 'DBMS software manages persistent, shared data efficiently and reliably. The transaction concept ensures ACID properties: atomicity, consistency, isolation, and durability. Concurrency control protocols like two-phase locking prevent interference between concurrent transactions. Recovery systems restore the database to a consistent state after failures using logging and checkpoint mechanisms. Query optimization selects efficient execution plans for SQL queries.',
    url: 'https://pages.cs.wisc.edu/~dbbook/',
    doi: '10.5555/1170794',
    language: 'en',
    type: 'book'
  },
  {
    id: 'db-003',
    title: 'An Introduction to Database Systems',
    author: 'C. J. Date',
    year: 2003,
    content: 'The relational model is a mathematical foundation for database systems based on set theory and predicate logic. A relation is a table with rows representing tuples and columns representing attributes. Keys uniquely identify tuples within relations. Integrity constraints enforce business rules and maintain data quality. The relational algebra provides operators like selection, projection, and join for querying relations. SQL is a practical implementation of the relational model.',
    url: 'https://www.oreilly.com/library/view/introduction-to-database/9780321444504/',
    doi: '10.5555/862248',
    language: 'en',
    type: 'book'
  },
  {
    id: 'db-004',
    title: 'NoSQL Distilled: A Brief Guide to the Emerging World of Polyglot Persistence',
    author: 'Pramod Sadalage, Martin Fowler',
    year: 2012,
    content: 'NoSQL databases emerged to address the scalability, performance, and flexibility requirements of web-scale applications. Key-value stores provide simple access patterns with excellent performance. Document databases store semi-structured data as JSON or XML documents. Column-family stores organize data into column families for efficient querying. Graph databases excel at storing and traversing highly connected data. Polyglot persistence uses multiple database technologies for different use cases.',
    url: 'https://martinfowler.com/books/nosql.html',
    doi: '10.5555/236269',
    language: 'en',
    type: 'book'
  },
  {
    id: 'db-005',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    year: 2017,
    content: 'Data-intensive applications need to store, process, and serve large volumes of data efficiently. Reliability means the system works correctly even when faults occur. Scalability enables handling increased load through strategies like scaling up or scaling out. Maintainability allows engineers to evolve the system productively. Different data models and query languages optimize for different use cases: relational, document, graph, and time-series data each have distinct advantages.',
    url: 'https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/',
    doi: '10.5555/3060590',
    language: 'en',
    type: 'book'
  },
  {
    id: 'db-006',
    title: 'SQL Performance Explained',
    author: 'Markus Winand',
    year: 2012,
    content: 'Database performance depends on proper indexing, query formulation, and execution plan selection. B-tree indexes accelerate equality and range queries on indexed columns. The query optimizer uses statistics about data distribution to estimate costs of different execution plans. Full table scans become efficient when accessing a large fraction of rows. Join algorithms include nested loops, hash joins, and merge joins, each optimal for different scenarios.',
    url: 'https://use-the-index-luke.com/',
    doi: '10.13140/2.1.4685.5043',
    language: 'en',
    type: 'book'
  },
  {
    id: 'db-007',
    title: 'MongoDB: The Definitive Guide',
    author: 'Kristina Chodorow',
    year: 2013,
    content: 'MongoDB is a document-oriented database that stores data as BSON documents with dynamic schemas. Collections group related documents together. Indexes support efficient query execution on document fields. Replication provides redundancy and high availability through replica sets. Sharding enables horizontal scaling by distributing data across multiple machines. Aggregation framework supports complex data processing pipelines similar to SQL grouping and filtering.',
    url: 'https://www.oreilly.com/library/view/mongodb-the-definitive/9781449344803/',
    doi: '10.5555/2505696',
    language: 'en',
    type: 'book'
  },
  // ==================== ALGORITMOS Y ESTRUCTURAS DE DATOS ====================
  {
    id: 'algo-001',
    title: 'Introduction to Algorithms',
    author: 'Thomas Cormen, Charles Leiserson, Ronald Rivest, Clifford Stein',
    year: 2009,
    content: 'An algorithm is a finite sequence of well-defined instructions that solve a computational problem. Algorithm analysis determines the resources required in terms of time and space complexity. Big-O notation characterizes asymptotic upper bounds on growth rates. Divide and conquer algorithms like merge sort and quicksort recursively break problems into smaller subproblems. Dynamic programming solves problems with overlapping subproblems by storing results in a table for reuse.',
    url: 'https://mitpress.mit.edu/books/introduction-algorithms-third-edition',
    doi: '10.5555/1614191',
    language: 'en',
    type: 'book'
  },
  {
    id: 'algo-002',
    title: 'The Art of Computer Programming, Volume 1: Fundamental Algorithms',
    author: 'Donald Knuth',
    year: 1997,
    content: 'The art of programming is the ability to organize a thousand lines of code at once, writing them correctly so they work together harmoniously. Information structures are fundamental ways to organize data: lists, trees, and graphs. Algorithms for searching and sorting form the basis of many computer operations. Mathematical analysis of algorithms reveals the principles that determine their efficiency and correctness.',
    url: 'https://www-cs-faculty.stanford.edu/~knuth/taocp.html',
    doi: '10.5555/273356',
    language: 'en',
    type: 'book'
  },
  {
    id: 'algo-003',
    title: 'Algorithms',
    author: 'Robert Sedgewick, Kevin Wayne',
    year: 2011,
    content: 'Algorithms are step-by-step procedures for solving computational problems. Data structures organize data to enable efficient algorithms. Arrays provide constant-time random access but costly insertion and deletion. Linked lists enable efficient insertion and deletion but require sequential access. Hash tables provide near-constant-time lookup, insertion, and deletion on average by mapping keys to array indices using a hash function.',
    url: 'https://algs4.cs.princeton.edu/',
    doi: '10.5555/2020986',
    language: 'en',
    type: 'book'
  },
  {
    id: 'algo-004',
    title: 'Algorithm Design Manual',
    author: 'Steven Skiena',
    year: 2008,
    content: 'The key to algorithm design is thinking about data the right way: how to represent it so that the relevant properties can be extracted efficiently. Greedy algorithms build up solutions incrementally by making locally optimal choices. Backtracking explores search spaces systematically by trying partial solutions and abandoning those that cannot possibly lead to optimal solutions. Graph algorithms include traversal, shortest path, minimum spanning tree, and network flow.',
    url: 'http://www.algorist.com/',
    doi: '10.5555/1464150',
    language: 'en',
    type: 'book'
  },
  {
    id: 'algo-005',
    title: 'Data Structures and Algorithms in Java',
    author: 'Michael Goodrich, Roberto Tamassia',
    year: 2014,
    content: 'Data structures are systematic ways of organizing and accessing data. Arrays and lists store elements in linear sequences. Stacks and queues are abstract data types following last-in-first-out and first-in-first-out disciplines respectively. Trees organize elements in hierarchical structures enabling efficient search and update operations. Graphs model pairwise relationships among arbitrary objects and support traversal and connectivity algorithms.',
    url: 'https://www.wiley.com/en-us/Data+Structures+and+Algorithms+in+Java%2C+5th+Edition-p-9781118262166',
    doi: '10.5555/2544630',
    language: 'en',
    type: 'book'
  },
  {
    id: 'algo-006',
    title: 'Cracking the Coding Interview: 189 Programming Questions and Solutions',
    author: 'Gayle Laakmann McDowell',
    year: 2015,
    content: 'Technical interviews test candidates ability to solve algorithmic problems under time pressure. Key data structures to master include arrays, linked lists, stacks, queues, hash tables, trees, and graphs. Common algorithm categories encompass sorting and searching, dynamic programming, recursion, and string manipulation. Big-O analysis demonstrates understanding of time and space efficiency. Communication skills matter as much as coding ability in interviews.',
    url: 'https://www.crackingthecodinginterview.com/',
    doi: '10.5555/273356',
    language: 'en',
    type: 'book'
  },
  {
    id: 'algo-007',
    title: 'Grokking Algorithms: An Illustrated Guide for Programmers and Other Curious People',
    author: 'Aditya Bhargava',
    year: 2016,
    content: 'Binary search cuts the search space in half with each comparison, achieving O(log n) time complexity. Selection sort finds the smallest element and moves it to the front repeatedly. Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem. Quicksort partitions around a pivot with average O(n log n) performance. Breadth-first search explores neighbors layer by layer to find shortest paths in unweighted graphs.',
    url: 'https://www.manning.com/books/grokking-algorithms',
    doi: '10.5555/3060590',
    language: 'en',
    type: 'book'
  },
  // ==================== INGENIERIA DE SOFTWARE ====================
  {
    id: 'se-001',
    title: 'Software Engineering: A Practitioners Approach',
    author: 'Roger Pressman, Bruce Maxim',
    year: 2014,
    content: 'Software engineering is the application of a systematic, disciplined, quantifiable approach to the development, operation, and maintenance of software. The software development life cycle includes requirements analysis, design, coding, testing, and maintenance. Process models include waterfall, iterative, and agile approaches. Software quality assurance ensures that project deliverables meet specified requirements through reviews, testing, and quality metrics.',
    url: 'https://www.mheducation.com/highered/product/software-engineering-practitioner-s-approach-pressman-maxim/M0078022123.html',
    doi: '10.5555/2689705',
    language: 'en',
    type: 'book'
  },
  {
    id: 'se-002',
    title: 'Agile Software Development, Principles, Patterns, and Practices',
    author: 'Robert Martin',
    year: 2002,
    content: 'Agile development is an iterative and incremental approach to software development that emphasizes collaboration, working software, and responding to change. The SOLID principles guide object-oriented design: Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. Test-driven development writes tests before code to drive design and ensure correctness. Continuous integration merges developer changes frequently and runs automated tests.',
    url: 'https://www.oreilly.com/library/view/agile-software-development/0135974445/',
    doi: '10.5555/572457',
    language: 'en',
    type: 'book'
  },
  {
    id: 'se-003',
    title: 'Code Complete: A Practical Handbook of Software Construction',
    author: 'Steve McConnell',
    year: 2004,
    content: 'Code construction is the activity of creating working software by writing source code. High-quality code is readable, maintainable, and correct. Effective naming, commenting, and formatting make code easier to understand. Control structures should be simple and use error handling appropriately. Code reviews, unit testing, and integration testing verify correct behavior. Debugging skills include isolating problems, understanding root causes, and validating fixes.',
    url: 'https://www.oreilly.com/library/view/code-complete-second/0735619670/',
    doi: '10.5555=109517',
    language: 'en',
    type: 'book'
  },
  {
    id: 'se-004',
    title: 'Domain-Driven Design: Tackling Complexity in the Heart of Software',
    author: 'Eric Evans',
    year: 2003,
    content: 'Domain-driven design is an approach to software development that centers the development on a rich domain model based on a deep understanding of the business domain. Ubiquitous language bridges the gap between technical and business teams by using consistent terminology. Bounded contexts define boundaries within which a particular model applies. Aggregates group related objects that are treated as a unit for data changes. Repositories provide collection-like interfaces for retrieving domain objects.',
    url: 'https://www.domainlanguage.com/ddd/',
    doi: '10.5555=862248',
    language: 'en',
    type: 'book'
  },
  {
    id: 'se-005',
    title: 'Software Architecture in Practice',
    author: 'Len Bass, Paul Clements, Rick Kazman',
    year: 2012,
    content: 'Software architecture defines the structures of a system, comprising software elements, their externally visible properties, and the relationships among them. Architecture is crucial because it determines quality attributes like performance, security, and modifiability. Architectural patterns like layered architecture, microservices, and event-driven architecture provide proven solutions to recurring design problems. Architecture documentation communicates design decisions to stakeholders.',
    url: 'https://www.oreilly.com/library/view/software-architecture-in/9780132943369/',
    doi: '10.5555=2505696',
    language: 'en',
    type: 'book'
  },
  {
    id: 'se-006',
    title: 'Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation',
    author: 'Jez Humble, David Farley',
    year: 2010,
    content: 'Continuous delivery is a software development practice where code changes are automatically built, tested, and prepared for release to production. The deployment pipeline automates the path from commit to release. Build automation ensures code compiles and passes unit tests. Acceptance testing validates functional requirements. Infrastructure as code manages servers and environments through version-controlled configuration. Blue-green deployments and canary releases reduce deployment risk.',
    url: 'https://continuousdelivery.com/',
    doi: '10.5555=186897',
    language: 'en',
    type: 'book'
  },
  {
    id: 'se-007',
    title: 'The DevOps Handbook: How to Create World-Class Agility, Reliability, and Security in Technology Organizations',
    author: 'Gene Kim, Patrick Debois, John Willis, Jez Humble',
    year: 2016,
    content: 'DevOps is a set of practices that combines software development and IT operations to shorten the systems development life cycle. The Three Ways describe the principles underlying DevOps: flow of work from left to right, feedback loops from right to left, and continuous learning. Continuous integration frequently merges code changes. Continuous deployment automates releasing to production. Monitoring and metrics enable data-driven improvement of systems and processes.',
    url: 'https://itrevolution.com/the-devops-handbook/',
    doi: '10.5555=2963953',
    language: 'en',
    type: 'book'
  },
  {
    id: 'se-008',
    title: 'Test Driven Development: By Example',
    author: 'Kent Beck',
    year: 2002,
    content: 'Test-driven development is a software development process that relies on the repetition of a short cycle: write a failing test, write the minimum code to pass the test, and refactor the code. Red-green-refactor is the TDD mantra. Tests serve as documentation of expected behavior. Refactoring improves code design while tests ensure behavior preservation. TDD builds confidence to change code and eliminates the fear of breaking existing functionality.',
    url: 'https://www.oreilly.com/library/view/test-driven-development/0321146530/',
    doi: '10.5555=572457',
    language: 'en',
    type: 'book'
  },
  // ==================== MATEMATICAS COMPUTACIONALES ====================
  {
    id: 'math-001',
    title: 'Discrete Mathematics and Its Applications',
    author: 'Kenneth Rosen',
    year: 2018,
    content: 'Discrete mathematics studies mathematical structures that are fundamentally discrete rather than continuous. Logic and proofs form the foundation of mathematical reasoning. Sets, functions, and relations are fundamental structures. Combinatorics counts and enumerates discrete objects. Graph theory studies pairwise relationships. Trees are graphs without cycles used in data structures and algorithms. Number theory studies integers and has applications in cryptography.',
    url: 'https://www.mheducation.com/highered/product/discrete-mathematics-its-applications-rosen/M9781260091991.html',
    doi: '10.5555=3347054',
    language: 'en',
    type: 'book'
  },
  {
    id: 'math-002',
    title: 'Concrete Mathematics: A Foundation for Computer Science',
    author: 'Ronald Graham, Donald Knuth, Oren Patashnik',
    year: 1994,
    content: 'Concrete mathematics is a blend of continuous and discrete mathematics that provides important tools for computer science. Recurrence relations describe sequences defined in terms of previous values. Sums and products arise frequently in algorithm analysis. Generating functions encode sequences as coefficients of power series enabling manipulation of entire sequences. Asymptotic methods approximate the growth of functions for large inputs.',
    url: 'https://www-cs-faculty.stanford.edu/~knuth/gkp.html',
    doi: '10.5555=179163',
    language: 'en',
    type: 'book'
  },
  {
    id: 'math-003',
    title: 'Linear Algebra and Its Applications',
    author: 'David Lay',
    year: 2015,
    content: 'Linear algebra studies vectors, matrices, and linear transformations. Systems of linear equations can be solved using Gaussian elimination. Vector spaces and subspaces provide abstract frameworks for geometric reasoning. Eigenvalues and eigenvectors characterize the behavior of linear transformations. Matrix decompositions like singular value decomposition have applications in data science, computer graphics, and machine learning.',
    url: 'https://www.pearson.com/store/p/linear-algebra-and-its-applications/',
    doi: '10.5555=2773144',
    language: 'en',
    type: 'book'
  },
  {
    id: 'math-004',
    title: 'Probability and Statistics for Engineering and the Sciences',
    author: 'Jay Devore',
    year: 2015,
    content: 'Probability quantifies the likelihood of events and provides a mathematical framework for reasoning under uncertainty. Random variables map outcomes to numbers. Discrete distributions include binomial and Poisson. Continuous distributions include normal and exponential. Statistical inference uses sample data to draw conclusions about populations. Hypothesis testing assesses claims about population parameters. Confidence intervals estimate unknown parameters with specified precision.',
    url: 'https://www.cengage.com/c/probability-and-statistics-for-engineering-and-the-sciences-9e-devore/',
    doi: '10.5555=1614191',
    language: 'en',
    type: 'book'
  },
];

const sampleTexts = [
  {
    title: 'Texto con plagio directo (ES)',
    text: 'La inteligencia artificial es una rama de la informática que se ocupa de la creación de sistemas capaces de realizar tareas que normalmente requieren inteligencia humana. Los sistemas de IA modernos utilizan redes neuronales profundas para aprender representaciones jerárquicas de datos.',
    language: 'es' as const
  },
  {
    title: 'Texto con paráfrasis (EN)',
    text: 'Artificial intelligence involves developing computing systems that can perform tasks typically requiring human cognition. Modern AI systems employ deep neural architectures to learn hierarchical data representations automatically.',
    language: 'en' as const
  },
  {
    title: 'Texto original sin plagio',
    text: 'La computación cuántica representa un paradigma completamente nuevo en el procesamiento de información. Utilizando los principios de superposición y entrelazamiento cuántico, estos sistemas pueden resolver problemas matemáticos específicos exponencialmente más rápido que los computadores clásicos tradicionales.',
    language: 'es' as const
  },
  {
    title: 'Texto con cita fantasma',
    text: 'Según varios autores (García, 2025), la aplicación de metodologías ágiles mejora la productividad. Otros estudios (López et al., 2024) confirman estos hallazgos.\n\nReferencias\nPérez, J. (2020). Fundamentos de desarrollo.',
    language: 'es' as const
  }
];

const typeIcons: Record<PlagiarismType, React.ReactNode> = {
  'direct': <FileWarning className="h-4 w-4 text-red-600" />,
  'paraphrase': <MessageSquareText className="h-4 w-4 text-orange-600" />,
  'idea': <Brain className="h-4 w-4 text-purple-600" />,
  'self': <Copy className="h-4 w-4 text-yellow-600" />,
  'ghost_citation': <Link2 className="h-4 w-4 text-pink-600" />,
  'translation': <Globe className="h-4 w-4 text-blue-600" />,
  'structure': <Layout className="h-4 w-4 text-indigo-600" />,
  'data': <Table2 className="h-4 w-4 text-teal-600" />,
  'methodology': <FlaskConical className="h-4 w-4 text-cyan-600" />,
  'author_omission': <UserX className="h-4 w-4 text-rose-600" />
};

const typeColors: Record<PlagiarismType, string> = {
  'direct': 'bg-red-50 border-red-300',
  'paraphrase': 'bg-orange-50 border-orange-300',
  'idea': 'bg-purple-50 border-purple-300',
  'self': 'bg-yellow-50 border-yellow-300',
  'ghost_citation': 'bg-pink-50 border-pink-300',
  'translation': 'bg-blue-50 border-blue-300',
  'structure': 'bg-indigo-50 border-indigo-300',
  'data': 'bg-teal-50 border-teal-300',
  'methodology': 'bg-cyan-50 border-cyan-300',
  'author_omission': 'bg-rose-50 border-rose-300'
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

async function fetchLiveRepositoryDocs(text: string): Promise<{ sources: SourceDocument[]; statuses: RepoStatus[] }> {
  const t0 = performance.now();
  const statuses: RepoStatus[] = [
    { name: 'CrossRef', status: 'pending', count: 0 },
    { name: 'Semantic Scholar', status: 'pending', count: 0 },
    { name: 'arXiv', status: 'pending', count: 0 },
    { name: 'Open Library', status: 'pending', count: 0 },
  ];

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { sources: [], statuses: statuses.map(s => ({ ...s, status: 'error' as const })) };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/plagiarism-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        text,
        documentTitle: 'Análisis de Plagio',
        language: 'auto',
        method: 'hybrid',
        checkRepositories: true,
      }),
    });

    const latencyMs = Math.round(performance.now() - t0);

    if (!res.ok) {
      return { sources: [], statuses: statuses.map(s => ({ ...s, status: 'error' as const, latencyMs })) };
    }

    const data = await res.json();
    const repoResults: Array<{ source: string; documents: Array<{ title: string; author: string; year: number; abstract: string; url: string; doi?: string }> }> = data.repositoryResults || [];

    const updatedStatuses: RepoStatus[] = statuses.map(s => {
      const repo = repoResults.find(r => r.source === s.name);
      return {
        ...s,
        status: repo ? 'ok' as const : 'error' as const,
        count: repo?.documents.length || 0,
        latencyMs,
      };
    });

    const sources: SourceDocument[] = repoResults.flatMap((repo, repoIdx) =>
      repo.documents.map((doc, docIdx) => ({
        id: `repo-${repoIdx}-${docIdx}`,
        title: doc.title,
        author: doc.author,
        year: doc.year,
        content: doc.abstract || doc.title,
        url: doc.url,
        doi: doc.doi,
        language: 'en',
        type: repo.source === 'Open Library' ? 'book' : 'academic' as 'academic' | 'book',
      }))
    );

    return { sources, statuses: updatedStatuses };
  } catch {
    const latencyMs = Math.round(performance.now() - t0);
    return { sources: [], statuses: statuses.map(s => ({ ...s, status: 'error' as const, latencyMs })) };
  }
}

export function PlagiarismDetectionPanel() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState<'idle' | 'fetching' | 'analyzing'>('idle');
  const [report, setReport] = useState<PlagiarismReport | null>(null);
  const [repoStatuses, setRepoStatuses] = useState<RepoStatus[]>([]);
  const [liveSourceCount, setLiveSourceCount] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<'auto' | 'es' | 'en'>('auto');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState('');
  const [extractingPdf, setExtractingPdf] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [filterType, setFilterType] = useState<PlagiarismType | 'all'>('all');
  const [showBreakdown, setShowBreakdown] = useState(true);

  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (url && key) {
      const sb = createClient(url, key);
      sb.auth.getUser().then(({ data: { user } }) => {
        setCurrentUser(user);
        if (user) loadHistory(user.id);
      });
    }
  }, []);

  const loadHistory = async (userId: string) => {
    const h = await advancedPlagiarismDetector.getAnalysisHistory(userId);
    setAnalysisHistory(h);
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const arr = new Uint8Array(e.target?.result as ArrayBuffer);
          let text = '', i = 0;
          while (i < arr.length) {
            const b = arr[i];
            if (b === 0x42 && arr[i + 1] === 0x54) {
              i += 2;
              while (i < arr.length && arr[i] !== 0x45 && arr[i] !== 0x65) {
                const c = String.fromCharCode(arr[i]);
                if ((c >= ' ' && c <= '~') || c === '\n' || c === '\r' || c === '\t') text += c;
                i++;
              }
            } else if (b >= 32 && b <= 126) {
              text += String.fromCharCode(b);
            }
            i++;
          }
          const cleaned = text.split(/[\n\r]+/).map(l => l.trim()).filter(l => l.length > 0).join(' ').replace(/\s+/g, ' ').substring(0, 50000);
          resolve(cleaned || text.substring(0, 50000));
        } catch (err) { reject(err); }
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPdfError('');
    if (!file.type.includes('pdf') && !file.name.endsWith('.pdf')) {
      setPdfError('Por favor carga un archivo PDF válido');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPdfError('El archivo es demasiado grande (máximo 10 MB)');
      return;
    }
    setPdfFile(file);
    setExtractingPdf(true);
    try {
      const text = await extractTextFromPdf(file);
      setPdfText(text);
      setInputText(text);
    } catch {
      setPdfError('Error al procesar el PDF. Intenta con otro archivo.');
      setPdfFile(null);
      setPdfText('');
    } finally {
      setExtractingPdf(false);
    }
  };

  const clearPdf = () => {
    setPdfFile(null);
    setPdfText('');
    setPdfError('');
    if (inputText === pdfText) setInputText('');
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setReport(null);
    setSaveStatus('idle');
    setRepoStatuses([]);
    setLiveSourceCount(0);

    try {
      // Phase 1: Fetch live repository documents
      setAnalysisPhase('fetching');
      const { sources: liveSources, statuses } = await fetchLiveRepositoryDocs(inputText);
      setRepoStatuses(statuses);
      setLiveSourceCount(liveSources.length);

      // Phase 2: Run plagiarism analysis with local + live sources
      setAnalysisPhase('analyzing');
      const combinedSources = [...sourceDocuments, ...liveSources];
      const result = await advancedPlagiarismDetector.analyzeFull(inputText, combinedSources);
      setReport(result);

      if (currentUser) {
        setSaveStatus('saving');
        const savedId = await advancedPlagiarismDetector.saveFullReport(
          currentUser.id,
          pdfFile?.name || 'Análisis de texto',
          inputText,
          result
        );
        setSaveStatus(savedId ? 'saved' : 'error');
        if (savedId) loadHistory(currentUser.id);
      }
    } catch (err) {
      console.error('Error analyzing plagiarism:', err);
      setSaveStatus('error');
    } finally {
      setIsAnalyzing(false);
      setAnalysisPhase('idle');
    }
  };

  const handleDeleteAnalysis = async (analysisId: string) => {
    if (!currentUser) return;
    const ok = await advancedPlagiarismDetector.deleteAnalysis(analysisId);
    if (ok) loadHistory(currentUser.id);
  };

  const filteredMatches = report?.matches.filter(m => filterType === 'all' || m.type === filterType) || [];

  const totalPlagiarismTypes = report
    ? Object.values(report.breakdownByType).reduce((sum, b) => sum + b.count, 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-8 w-8" />
          <h2 className="text-3xl font-bold">Detección Avanzada de Plagios</h2>
        </div>
        <p className="text-red-100 text-lg">
          Análisis completo: 10 tipos de plagio - Directo, Paráfrasis, Ideas, Autoplagio, Citas Fantasma, Traducción, Estructura, Datos, Metodología, Omisión de Autoría
        </p>
      </div>

      {/* Text Input */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-500" />
            Texto o PDF a Analizar
          </h3>
          {currentUser && (
            <button onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <History className="h-4 w-4" />
              <span>Historial ({analysisHistory.length})</span>
            </button>
          )}
        </div>

        {/* History Panel */}
        {showHistory && analysisHistory.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <History className="h-4 w-4 mr-2 text-gray-600" />
              Análisis Anteriores
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {analysisHistory.map((h: any) => (
                <div key={h.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{h.document_title}</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className={h.status === 'safe' ? 'text-green-600' : h.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}>
                        {Math.round(h.overall_similarity)}% plagio
                      </span>
                      <span>{h.total_words} palabras</span>
                      <span>{new Date(h.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteAnalysis(h.id)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PDF Upload */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center mb-3">
            <Upload className="h-5 w-5 mr-2 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Cargar Documento PDF</h4>
          </div>
          {pdfFile ? (
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border border-blue-200 flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{pdfFile.name}</p>
                    <p className="text-sm text-gray-600">{(pdfFile.size / 1024).toFixed(2)} KB - {pdfText.split(/\s+/).length} palabras</p>
                  </div>
                </div>
                <button onClick={clearPdf} className="ml-3 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <label className="block cursor-pointer">
              <div className="p-6 border-2 border-dashed border-blue-300 rounded-lg text-center hover:bg-blue-100 transition-colors">
                <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900">{extractingPdf ? 'Procesando PDF...' : 'Arrastra un PDF aquí o haz clic para cargar'}</p>
              </div>
              <input type="file" accept=".pdf" onChange={handlePdfUpload} disabled={extractingPdf} className="hidden" />
            </label>
          )}
          {pdfError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{pdfError}</p>
            </div>
          )}
        </div>

        {/* Sample Texts */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">O elige textos de ejemplo:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sampleTexts.map((sample, i) => (
              <button key={i} onClick={() => { setInputText(sample.text); clearPdf(); }}
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium text-gray-900">{sample.title}</h5>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${sample.language === 'es' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {sample.language === 'es' ? 'ES' : 'EN'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{sample.text.substring(0, 100)}...</p>
              </button>
            ))}
          </div>
        </div>

        <textarea value={inputText} onChange={e => setInputText(e.target.value)}
          placeholder="Introduce el texto a analizar para detectar múltiples tipos de plagio..."
          className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none" />

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            {inputText.length} caracteres | {inputText.split(/\s+/).filter(w => w.length > 0).length} palabras
          </div>
          <div className="flex items-center space-x-3">
            {saveStatus === 'saved' && <span className="text-xs text-green-600 flex items-center"><CheckCircle className="h-3 w-3 mr-1" />Guardado en BD</span>}
            {saveStatus === 'saving' && <span className="text-xs text-blue-600 flex items-center"><Clock className="h-3 w-3 mr-1 animate-spin" />Guardando...</span>}
            {saveStatus === 'error' && <span className="text-xs text-red-600">Error al guardar</span>}
            <button onClick={handleAnalyze} disabled={!inputText.trim() || isAnalyzing}
              className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {isAnalyzing ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div><span>Analizando...</span></>
              ) : (
                <><Search className="h-4 w-4" /><span>Analizar Plagio</span></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          {analysisPhase === 'fetching' ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Consultando repositorios científicos...</h3>
              <div className="flex justify-center gap-3 mt-4 flex-wrap">
                {['CrossRef', 'Semantic Scholar', 'arXiv', 'Open Library'].map(name => (
                  <span key={name} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700">
                    <Globe className="h-3 w-3 animate-pulse" />{name}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analizando 10 tipos de plagio...</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 max-w-2xl mx-auto text-xs text-gray-500">
                <span className="p-2 bg-red-50 rounded">Directo</span>
                <span className="p-2 bg-orange-50 rounded">Paráfrasis</span>
                <span className="p-2 bg-purple-50 rounded">Ideas</span>
                <span className="p-2 bg-yellow-50 rounded">Autoplagio</span>
                <span className="p-2 bg-pink-50 rounded">Citas Fantasma</span>
                <span className="p-2 bg-blue-50 rounded">Traducción</span>
                <span className="p-2 bg-indigo-50 rounded">Estructura</span>
                <span className="p-2 bg-teal-50 rounded">Datos</span>
                <span className="p-2 bg-cyan-50 rounded">Metodología</span>
                <span className="p-2 bg-rose-50 rounded">Omisión Autoría</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Results */}
      {!isAnalyzing && report && (
        <div className="space-y-6">
          {/* Repository Status Panel */}
          {repoStatuses.length > 0 && (
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                <Server className="h-4 w-4 mr-2 text-blue-500" />
                Repositorios Científicos Consultados
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {liveSourceCount} documentos recuperados
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {repoStatuses.map(repo => (
                  <div key={repo.name} className={`flex items-center justify-between p-3 rounded-lg border ${
                    repo.status === 'ok' ? 'bg-green-50 border-green-200' :
                    repo.status === 'error' ? 'bg-red-50 border-red-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2 min-w-0">
                      {repo.status === 'ok'
                        ? <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        : repo.status === 'error'
                        ? <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        : <div className="h-4 w-4 rounded-full border-2 border-gray-400 animate-spin flex-shrink-0" />
                      }
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{repo.name}</p>
                        <p className="text-xs text-gray-500">
                          {repo.status === 'ok' ? `${repo.count} docs` :
                           repo.status === 'error' ? 'Sin conexión' : 'Esperando...'}
                        </p>
                      </div>
                    </div>
                    {repo.latencyMs !== undefined && repo.status === 'ok' && (
                      <span className="text-xs text-gray-400 ml-1 flex-shrink-0">{repo.latencyMs}ms</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Overall Statistics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-orange-600" />
              Resumen del Análisis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Percentage Display */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-3">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                        <circle cx="64" cy="64" r="56" stroke={report.plagiarismPercentage > 30 ? '#dc2626' : report.plagiarismPercentage > 15 ? '#f59e0b' : '#10b981'}
                          strokeWidth="12" fill="none"
                          strokeDasharray={`${report.plagiarismPercentage * 3.52} 352`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-3xl font-bold text-gray-900">{Math.round(report.plagiarismPercentage)}%</span>
                          <span className="block text-xs text-gray-500">Plagio</span>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      report.status === 'safe' ? 'bg-green-100 text-green-700' :
                      report.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {report.status === 'safe' ? 'Documento Original' : report.status === 'warning' ? 'Plagio Moderado' : 'Alto Plagio'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <span className="text-2xl font-bold text-green-600">{Math.round(report.nonPlagiarismPercentage)}%</span>
                      <span className="block text-xs text-green-700">No Plagio</span>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <span className="text-2xl font-bold text-red-600">{Math.round(report.plagiarismPercentage)}%</span>
                      <span className="block text-xs text-red-700">Plagio</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Estadísticas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total palabras:</span>
                    <span className="font-semibold">{report.totalWords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Palabras plagiadas:</span>
                    <span className="font-semibold text-red-600">{report.plagiarizedWords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuentes analizadas:</span>
                    <span className="font-semibold">{report.sourcesChecked} ({liveSourceCount} en vivo)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Citas verificadas:</span>
                    <span className="font-semibold text-green-600">{report.citationsVerified}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Citas fantasma:</span>
                    <span className="font-semibold text-pink-600">{report.ghostCitationsFound}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiempo análisis:</span>
                    <span className="font-semibold">{report.analysisTimeMs}ms</span>
                  </div>
                </div>
              </div>

              {/* Matches Count */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Detecciones</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="text-3xl font-bold text-gray-900">{report.matches.length}</span>
                  <span className="block text-sm text-gray-600">fragmentos detectados</span>
                </div>
                <div className="text-xs text-gray-500">
                  En {totalPlagiarismTypes} categorías de plagio
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown by Type */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-purple-600" />
                Desglose por Tipo de Plagio
              </h3>
              <button onClick={() => setShowBreakdown(!showBreakdown)}
                className="text-sm text-gray-500 hover:text-gray-700">
                {showBreakdown ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {showBreakdown && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {(Object.entries(report.breakdownByType) as [PlagiarismType, { count: number; percentage: number; words: number }][]).map(([type, data]) => (
                  <button key={type} onClick={() => setFilterType(filterType === type ? 'all' : type)}
                    className={`p-3 rounded-lg border transition-all ${filterType === type ? 'ring-2 ring-red-500 ring-offset-2' : ''} ${typeColors[type]}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {typeIcons[type]}
                      <span className="text-xs font-medium text-gray-900 truncate">
                        {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-gray-900">{data.count}</span>
                      <span className="block text-xs text-gray-600">{data.percentage}% del plagio</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detailed Matches */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-orange-600" />
                Fragmentos Detectados ({filteredMatches.length})
              </h3>
              <select value={filterType} onChange={e => setFilterType(e.target.value as PlagiarismType | 'all')}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-red-500">
                <option value="all">Todos los tipos</option>
                {Object.entries(report.breakdownByType).filter(([_, d]) => d.count > 0).map(([type]) => (
                  <option key={type} value={type}>{type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>
                ))}
              </select>
            </div>

            {filteredMatches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No se encontraron fragmentos con plagio
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMatches.map((match, index) => (
                  <div key={match.id} className={`border-l-4 rounded-lg p-4 ${typeColors[match.type]}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {typeIcons[match.type]}
                          <span className="font-semibold text-gray-900">{match.typeLabel}</span>
                        </div>
                        <span className="text-xs bg-white px-2 py-0.5 rounded">
                          {match.similarityScore}% similitud
                        </span>
                        <span className="text-xs text-gray-500">
                          Confianza: {match.confidence}%
                        </span>
                      </div>
                      {match.sourceUrl && (
                        <a href={match.sourceUrl} target="_blank" rel="noopener noreferrer"
                          className="p-1 text-blue-500 hover:text-blue-700">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h5 className="text-xs font-semibold text-gray-700 uppercase mb-1">Fragmento Infractor:</h5>
                        <div className="p-3 bg-white bg-opacity-70 rounded border border-gray-200">
                          <p className="text-sm text-gray-800">"{match.infractingFragment}"</p>
                        </div>
                      </div>

                      {match.originalText && (
                        <div>
                          <h5 className="text-xs font-semibold text-gray-700 uppercase mb-1">Texto Original:</h5>
                          <div className="p-3 bg-gray-100 rounded border border-gray-200">
                            <p className="text-sm text-gray-600">"{match.originalText}"</p>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center"><BookOpen className="h-3 w-3 mr-1" /><strong>Fuente:</strong> {match.sourceDocument}</span>
                        <span className="flex items-center"><span className="font-semibold">Autor:</span> {match.sourceAuthor}</span>
                        <span className="flex items-center"><span className="font-semibold">Año:</span> {match.sourceYear}</span>
                        {match.locationPage && <span className="flex items-center"><span className="font-semibold">Página:</span> ~{match.locationPage}</span>}
                        <span className="flex items-center"><span className="font-semibold">Palabras:</span> {match.wordCount}</span>
                        {match.sourceDoi && <span className="flex items-center text-blue-600">DOI: {match.sourceDoi}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Initial State */}
      {!report && !isAnalyzing && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <Shield className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Detección Avanzada de Plagios</h3>
          <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
            Analiza textos para detectar 10 tipos diferentes de plagio, genera un reporte detallado con porcentajes,
            desglose por tipo, fuentes originales, autores y localización aproximada de cada fragmento.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {Object.entries(typeIcons).map(([type, icon]) => (
              <div key={type} className={`p-3 rounded-lg ${typeColors[type as PlagiarismType]}`}>
                <div className="flex items-center space-x-2">
                  {icon}
                  <span className="text-xs font-medium text-gray-900">
                    {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
