<style type="text/css">
table.workshop {
width: 100%;
margin: 10px 0;
font-size: 14px;
border-collapse: separate;
border-spacing: 0;
border:1px solid #ccc;
border-bottom:0;
border-right:0;
}

td {
border-bottom:1px solid #ccc;
border-right:1px solid #ccc;
padding:3px;
}

.subhead {
font-size:16px;
font-weight:600;
font-style:italic;
color:#555 !important;
}

sup {
vertical-align: super !important;
font-size: 10px !important;
}

.underline {
border-bottom: 1px solid #000;
padding-bottom: 5px;
}

.tall-line {
line-height:2.5em;
}

h3.data {
margin-bottom:7px;
}
</style>

<div id="middle" class="research">

<h1 style="margin-bottom: 20px;">Analysis and Visualization of the IV 2004 Contest Dataset</h1>

<div id="container" style="width:865px; margin-bottom:25px;">

<p>Börner, Katy, Richard Klavans, Michael Patek, Angela Zoss, Joseph R. Biberstine, Robert Light, Vincent Larivière, and Kevin W. Boyack (2012) Design and Update of a Classification System: The UCSD Map of Science. PLoS ONE 7(7): e39464. <a href="http://www.plosone.org/article/info%3Adoi%2F10.1371%2Fjournal.pone.0039464" target="_blank">doi:10.1371/journal.pone.0039464</a></p>
<br>

<h3 style="margin-bottom:7px;">Abstract:</h3>
<p>The presented work aims to identify major papers and their interrelations, topic trends over time, as well as major authors and their evolving co-authorship networks in the IV Contest 2004 data set. Paper-citation, co-citation, word co-occurrence, burst analysis and co-author analysis were used to analyze the data set. The results are visually presented as graphs, static Pajek [1] visualizations and interactive network layouts. This webpage complements our <a href="/docs/data/2004-InfoVis/contest_paper.pdf" target="_blank">two-page paper</a> submission.</p>
<br>

<h3 style="margin-bottom:7px;">Team</h3>
<p>This work was completed by the following team from the Indiana University School of Informatics and Computing:</p>
<ul class="middle">
<li>Weimao Ke</li>
<li>Katy Börner</li>
<li>Lalitha Viswanath</li> 
</ul>

<h3 style="margin-bottom:7px;">Tools</h3>
<ul class="middle">
<li>As an initial step, we cleaned the data as described in the "Data Cleaning" section below.</li>
<li>Microsoft Access, Microsoft Visual Basic, Microsoft DOM, Perl and Pajek too were used to analyze the dataset. Microsoft DOM and Microsoft Visual Basic were used to migrate the data from the given XML format into Access compatible format.</li>
<li>Using Microsoft Access, queries were created to obtain different views of the dataset such as number of co-authors per author, number of papers per author, number of citations per author, etc.</li>
<li>Pajek was used to visualize these results in a user-friendly and intuitive manner.</li>
<li>Microsoft Excel was used to analyze and visualize the burst of words in the dataset. This burst analysis was performed using Kleinberg's Burst algorithm [2] provided as a part of the <a href="http://iv.slis.indiana.edu" target="_blank">InfoVis CyberInfrastructure</a></li>
</ul>

<h3 style="margin-bottom:7px;">Data Cleaning</h3>
<p>Data cleaning comprised 80% of the time spent on this project. The data was converted into an MS-Access database provided below. Some results of the data cleaning are also shown below.</p>

<ol>
<li>Identifying Major Publication Venues (called sources) (<a href="http://iv.cns.iu.edu/ref/iv04contest/data/sources_old.htm" target="_blank">314 unique sources originally provided</a> ==> <a href="http://iv.cns.iu.edu/ref/iv04contest/data/sources_new.htm" target="_blank">106 unique sources after data cleaning</a>)
<ul class="middle">
<li>The source field was split with delimiter on ":" and extra spaces were trimmed.</li>
<li>Records with identical source descriptions were mapped in Visual Basic.</li>
<li>After sorting the records, additional source descriptions were mapped manually.</li>
</ul>
</li>

<li>Identifying Unique Keywords (<a href="http://iv.cns.iu.edu/ref/iv04contest/data/keyword_old.htm" target="_blank">1859 unique keywords originally provided</a> ==> <a href="http://iv.cns.iu.edu/ref/iv04contest/data/keyword_new.htm" target="_blank">1753 unique keywords after data cleaning</a>)
<ul class="middle">
<li>The table "<a href="http://iv.cns.iu.edu/ref/iv04contest/data/keyword_conversion_IV04_Task2.htm" target="_blank">keyword conversion</a>" contains all 89 records of rules that were applied to identify a unique list of keywords.</li>
</ul>
</li>

<li>Identifying Unique Authors (<a href="http://iv.cns.iu.edu/ref/iv04contest/data/authors_old.htm" target="_blank">1161 unique authors originally provided</a> ==> <a href="http://iv.cns.iu.edu/ref/iv04contest/data/author_merged.htm" target="_blank">1036 unique authors after data cleaning</a>)
<ul class="middle">
<li>Duplicate author names were identified by trimming the author name (e.g., Allen D. Maloney --> A. D. M.), sorting the resulting list and eliminating duplicates (after manual checks).</li>
<li>In addition, the last names of all authors were identified (e.g., F. David Fracchia --> Fracchia), sorted, and duplicate authors were merged again (after manual checks).</li>
<li>Altogether 191 duplicate author names were identified. See <a href="http://iv.cns.iu.edu/ref/iv04contest/data/duplicated_authors.htm" target="_blank">duplicate author ids</a>.</li>
<li>There was one paper (acm673478) with no author.</li>
</ul>
</li>

<li>Citation Year (<a href="http://iv.cns.iu.edu/ref/iv04contest/data/Publication_year.htm" target="_blank">Publication Years</a>)
<ul class="middle">
<li>There were 8507 references extracted from the original dataset. After elimination of duplicates (5), there were 8502 references obtained. The publication year information for non-ACM publications that are cited by papers in the IV data set was retrieved for 8178 out of the total 8502 cited papers. The remaining 324 citations do not contain any year information (e.g., T.W. Rauber. Tooldiag. Universidade de Lisboa, Dept. of Electrical Engineering.).</li>
<li>This info will be used to determine the total number of citations received each year (see Fig. 0.1) and to map the continuously evolving co-author space (Fig. 3.1.1).</li>
</ul>
</li>
</ol>

<p>Complete cleaned database: <a href="http://iv.cns.iu.edu/ref/iv04contest/iv04-contest.mdb" target="_blank">http://ella.slis.indiana.edu/~lviswana/iv04-contest.mdb</a></p>
<br>

<h3 style="margin-bottom:7px;">Relationship Among Various Components of Database</h3>
<a href="/docs/data/2004-InfoVis/db_relations.gif" target="_blank"><img src="/docs/data/2004-InfoVis/db_relations.gif" width="350" style="margin-top:7px;" alt="db_relations.gif"></a>
<br><br>

<h3 style="margin-bottom:7px;">Summary Statistics for the InfoVis 2004 Dataset</h3>
<ul class="middle">
<li>The dataset was analyzed using Microsoft Access and Microsoft Excel to get the summary statistics displayed in Figure 0.1. Raw data is available <a href="http://iv.cns.iu.edu/ref/iv04contest/data/InfoVis_task1.1.htm" target="_blank">here</a>. 614 papers were published between 1974 and 2004 (blue line).For each of the papers published in a given year, the number of references made in the papers to older publications was summed up (purple line). The total number of citation counts received by papers published in a given year was also obtained (brown line).</li>
<li>There are 429 papers that have an abstract, 424 papers with keywords, and 340 papers that have both an abstract and keywords.</li>
</ul>

<h3 class="data">Descriptive Statistics for Info Vis 2004 Dataset</h3>
<ul class="middle">
<li><b>Figure 0.1</b><br>
<a href="/docs/data/2004-InfoVis/year_count.gif" target="_blank"><img src="/docs/data/2004-InfoVis/year_count.gif" width="350" style="margin-top:7px;" alt="year_count.gif"></a>
</li>
<li><b>Analysis of Figure 0.1</b>
<ul class="middle">
<li>The plot shows that the number of Information Visualization papers is steadily increasing. The drop in the more recent years is most likely due to the fact that all papers are not available via the ACM library.</li>
<li>As expected, older papers had more time to attract citations and the total number of references per paper increases as the number of produced papers increases.</li>
<li>Papers published in 1995, 2000, 2002 show a significant increase in number of citations received as compared to citations received for papers published in 1999, 2001 or 1996. This might indicate the there were some papers published in 1999, 2000 or 2002 that were more significant milestones in Information Visualization research and formed the basis for further research.</li>
</ul>
</li>
</ul>

<h3 class="data">Task 1: Static Overview of 10 Years of InfoVis</h3>
<ul class="middle">
<li><b>Process:</b>
<ul class="middle">
<li>Knowledge domain visualization techniques [3] were applied to map the semantic space of the data set via citation analysis and co-citation analysis.</li>
<li>The results of the citation analysis are visualized in Pajek [1] and are shown in Image 1.1. All papers that got cited at least 20 times (15 papers) and all the papers that cited those papers and themselves got cited by other papers, at least 7 times (44 papers), were selected. Elimination of duplicate entries resulted in 47 such papers, using which the below network was built. Each paper is represented by a circle. Node size denotes the number of received citations. Node color denotes year of publication. Ring color denotes the average citation year. It is computed using the formula:<br><br>

<span class="underline">∑ <em>(number of times the paper is cited in a year * year in numerical form)</em></span><br>
<span class="tall-line"><em>number of years in which the paper is cited</em></span>
<br><br>

</li>
<li>Links represent direct citation links between papers.</li>
<li>The results of the co-citation analysis in Pajek are shown in Image 1.2. For the paper co-citation analysis, only those papers that have been cited simultaneously by another paper, no less than 5 times, were considered. The similarity weight has been computed as the number of times these papers have received citations together.</li>
<li>The references made by papers in the InfoVis dataset have been classified as those within the contest data set called IV core and others as ACM and non-ACM references. This is depicted in the diagram below to facilitate easier understanding of the insights provided thereafter.<br>
<img src="/docs/data/2004-InfoVis/paper_map.gif" width="350" style="margin-top:7px;" alt="paper_map.gif"></li>
<li>Out of the 8502 references, 1970 references are to papers within the contest data set, called IV core. Only 1810 references are to other ACM publications and 4722 to non-ACM papers. These statistics suggest that the InfoVis community seems to be surprisingly disconnected from other research areas.</li>
</ul>
</li>
</ul>

<h3 class="data">Paper-Citation Network</h3>
<ul class="middle">
<li><b>Image 1.1:</b><br>
<a href="/docs/data/2004-InfoVis/vs_citation.gif" target="_blank"><img src="/docs/data/2004-InfoVis/vs_citation.gif" width="350" style="margin-top:7px;" alt="vs_citation.gif"></a>
</li>
<br>
<li><b>Insight 1.1:</b>
<ul class="middle">
<li>Within IV core there are two papers that received 70 citations: Furnas's 1986 paper on <em>Generalized fisheye views</em>, and Robertson's 1991 paper on <em>Cone trees: animated 3D visualizations of hierarchical information</em>. Tufte's 1986 paper on <em>The visual display of quantitative information</em> was cited 40 times (see <a href="http://iv.cns.iu.edu/ref/iv04contest/data/article_cited_count_within_dataset.htm" target="_blank">article_cited_count_withinset</a>). It is interesting to note that papers within the IV core dataset have cited Bertin's 1983 book on <em>Semiology of graphics: diagrams, networks and maps</em>, the most number of times (14 times) amongst those in the non-ACM category. It is followed by Spence, R. and Apperley, M. <em>Database navigation: An office environment for the professional</em>, which was cited 9 times. The raw data for citation counts for articles, cited outside the core ACM dataset are at <a href="http://iv.cns.iu.edu/ref/iv04contest/data/article_cited_count_outside_Acm.htm" target="_blank">article_cited_count_outside_ACM</a>. This reference is an example of one of the problems we encountered during data cleaning. This reference has an Id associated with it 9 out of the 12 times that it has been referred. We found the 3 additional citations that were lost on account of this problem in the dataset by manually scanning the same. But it would be difficult to do the same across all references in the dataset.</li>
<li>Most nodes are a shade of green indicating that they are more recent, being published in between 1993 and 1995, and being cited in 1997 or beyond. This is also corroborated by the distribution of the number of papers published per year and number of citations per year in Figure 0.1.</li>
<li>Similarly, the border color for most nodes is a yellowgreen, indicating that the average citation year is between 1997 and 2000.</li>
<li>An interesting anomaly in this dataset that is evident from the visualization is that Robertson's 1999 paper <em>The Document Lens</em>, has been shown to be cited during earlier years, such as 1996, 1997, and 1995. This is impossible since a paper cannot be cited before it is published. This error in the latest version of the dataset has been beautifully captured in the visualization by the light yellowgreen color of the node (showing the year of publication) and the surrounding green color for the border(showing the average citation year). This shows that the quality of visualization and interpretation of information thereof depends largely on the quality of the dataset provided. A useful visualization capturing all the necessary information in the dataset can also be used to detect such errors in the data without having to peruse the raw data.</li>
</ul>
</li>
<li><b>Caption for Exhibit:</b>
<ul class="middle">
<li>The publication of the papers by Furnas 1986 and Robertson 1991 are the highlights of research in Information Visualization. These papers have the highest citation counts in the dataset, indicating that a large amount of research was spawned by these papers.</li>
</ul>
</li>
</ul>

<h3 class="data">Paper Co-Citation Network</h3>
<ul class="middle">
<li><b>Image 1.2:</b><br>
<a href="/docs/data/2004-InfoVis/vs_co_citation.gif" target="_blank"><img src="/docs/data/2004-InfoVis/vs_co_citation.gif" width="350" style="margin-top:7px;" alt="vs_co_citation.gif"></a></li>
<br>
<li>A link to an interactive visualization of the paper co-citation network is also provided in SVG format. Check the co-citation counts to view the growth of the paper-co-citation network on the basis of similarity weights.</li>
<br>
<li><b>Insight 1.2:</b>
<ul class="middle">
<li>The co-citation network places papers that are frequently cited together closer in space. A different picture emerges as compared to the citation network of individual papers in Image 1.1.The paper by Robertson, Mackinlay & Card, <em>Cone trees: animated 3D visualization of hierarchical information</em> appears to have among the highest number of co-citations (27) along with Furnas's <em>Generalized fisheye views</em>. It has been cited 19 times together with another of their publications, <em>The information visualizer: the information workspace</em> by Card, Robertson and Mackinlay.</li>
<li>Not surprisingly, it is the papers co-authored by the trio of Robertson, Mackinlay and Card that have been cited together most often. These authors also happen to have the strongest degree of collaboration and co-authorship amongst themselves, as discussed below.</li>
<li>Edward Tufte's 1986 paper on <em>Visualization of quantitative information</em> and Mackinlay's 1991 paper on <em>Cone trees: animated 3D visualization of hierarchical information</em> are not cited together very often (6), since both deal with visual representations of different kinds of information. This shows that the visualization reflects the underlying nature of co-citation amongst papers in an accurate manner, consistent with the nature of research presented in the papers.</li>
<li>A noteworthy point is that most of the highly co-cited papers were authored by Robertson et al, during the early part of the nineties, when Infovis as a field of research was taking roots. This was also the time when this trio was working together in the field of Information Visualization at Xerox.</li>
</ul>
</li>
<li><b>Caption for Exhibit:</b>
<ul class="middle">
<li>Co-citation network of highly cited papers and the major papers they influenced.</li>
</ul>
</li>
</ul>

<h3 class="data">Task 2: Characterize the major research areas and their evolution</h3>
<ul class="middle">
<li><b>Process:</b>
  <ul class="middle">
    <li>A burst analysis of words in the InfoVis dataset was performed to study the evolution and progress of different research areas. We used the burst detection code available via <a href="http://iv.slis.indiana.edu" target="_blank">http://iv.slis.indiana.edu</a> and the results of the burst algorithm were plotted in Microsoft Excel.</li>
    <li>The keywords were organized in terms of years and a burst analysis was performed on these keywords in order to detect those words that experience a sudden increase or burst in their usage.</li>
    <li>The burst analysis was performed on words contained in
      <ol class="middle">
        <li>Compound Terms in the Keywords of the dataset (<a href="http://iv.cns.iu.edu/ref/iv04contest/data/vs_burst_compound_keywors.txt" target="_blank">.txt input file</a>).</li>
        <li>Keywords and Title (<a href="http://iv.cns.iu.edu/ref/iv04contest/data/vs_burst_year_keyword_title.txt" target="_blank">.txt input file</a>).</li>
        <li>Keywords, Title and Abstracts (<a href="http://iv.cns.iu.edu/ref/iv04contest/data/vs_burst_year_keyword_title_abs.txt" target="_blank">.txt input file</a>).</li>
      </ol>
    </li>
  </ul>
<li>The results of all three burst analyses (<a href="http://iv.cns.iu.edu/ref/iv04contest/data/burst2.xls" target="_blank">.xls file</a>).</li>
</ul>

<h3 class="data">Burst Analysis of Compound Terms in the Keywords of the Dataset</h3>
<ul class="middle">
<li><b>Image 2.1:</b><br>
<a href="/docs/data/2004-InfoVis/burst_analysis.jpg" target="_blank"><img src="/docs/data/2004-InfoVis/burst_analysis.jpg" width="350" style="margin-top:7px;" alt="burst_analysis.jpg"></a></li>
<br>
<li><b>Insight 2.1:</b><br>
<table class="workshop">
<tr><td><b><i>Word</i></b></td><td><b><i>Burst Weight</i></b></td><td><b><i>Burst Years</i></b></td></tr>
<tr><td>Data visualization</td><td>3.7</td><td>1994-1995</td></tr>
<tr><td>Focus+context</td><td>4.29</td><td>1999-2002</td></tr>
<tr><td>Hierarchy</td><td>3.95</td><td>2000-2002</td></tr>
<tr><td>Human factors</td><td>3.42</td><td>1983-1994</td></tr>
<tr><td>Information Visualization</td><td>13.083</td><td>1998-present</td></tr>
<tr><td>User Interface</td><td>3.457</td><td>1983-1991</td></tr>
</table>
<ul class="middle">
<li>The burst analysis of compound keywords indicates that the focus of research from 1985-1991 was <em>user interface</em>. <em>Human factors</em> also has a high burst rate from 1974-1994.</li>
<li>Around 1991 is the time when research in Information Visualization (in terms of papers published) also reached a peak. Taking 1991 as the year when Information Visualization as a field finally began to mature, the burst analysis indicates that the early years of research were focused on human factors pertaining to information visualization, such as user interfaces, etc.</li>
<li>There were some seminal papers such as <em>Generalized fisheye views</em> and <em>Cone trees: animated 3D visualizations of hierarchical information</em> that were published during this period. Both of these papers deal with different methods of viewing information, with the latter being an improvement on the method described in the former.</li>
<li>Given that these two papers are the most cited papers in the IV contest data set we can draw the conclusion that user interface and human factors formed the crux of Information Visualization research in the early years of the field.</li>
<li>Subsequently, as the field matured, the focus shifted to <em>information visualization</em> as a field in itself. This is indicated by the corresponding burst in <em>information visualization</em> from 1998 onwards.</li>
</ul>
</li>
</ul>

<h3 class="data">Burst Analysis of Compound Terms in the Keywords of the Dataset</h3>
<ul class="middle">
<li><b>Image 2.2:</b><br>
<a href="/docs/data/2004-InfoVis/keywords_title_abs.jpg" target="_blank"><img src="/docs/data/2004-InfoVis/keywords_title_abs.jpg" width="350" style="margin-top:7px;" alt="keywords_title_abs.jpg"></a></li>
<br>
<li><b>Insight 2.2:</b>
  <ul class="middle">
    <li>The burst analysis for individual words in keywords, titles and abstracts shows that in the early years of InfoVis research, the focus was on <em>algorithm</em>, <em>performance</em>, <em>graphics</em>, <em>human</em>, etc indicating that the early research focused on creating useful and efficient algorithms, user-interface designs, etc.</li>
    <li>As the years progressed, the research focus shifted to integrating this research with the evolving Internet and parallelizing the algorithms, usage of network technologies and other similar efforts. This is indicated by the burst in the frequency of words such as <em>parallel</em>, <em>internet</em>, <em>network</em>, <em>dynamic</em>, <em>query</em> etc.</li>
  </ul>
    <p>On the basis of the burst analysis we can conclude that the following were the main areas of research in Infovis<br>
       <ul class="middle">
        <li>User interface design</li>
        <li>Human factors in information visualization</li>
        <li>Data mining and visualization</li>
        <li>Techniques for information visualization and representation</li>
        <li>Web applications and network technologies in Infovis</li>
      </ul>
</li>
</ul> 

<h3 class="data">Task 3: Identify the relationship among researchers in InfoVis</h3>

<p><b>Task 3.1: Where does a particular author/researcher fit within the research areas defined in task 2?</b>
<br>

<ul class="middle">
  <li><b>Process 3.1:</b>

    <ul class="middle">

      <li>We extracted the keywords from all the articles authored by George G. Robertson, Jock D. Mackinlay, Stuart K. Card, Steven F. Roth, John T. Stasko and Ben Shneiderman. The results for keyword counts for articles by
        <ul class="middle">
<li class=MsoNormal style='mso-margin-top-alt:auto;mso-margin-bottom-alt:

       auto;mso-list:l7 level3 lfo21;tab-stops:list 1.5in'><a

       href="data/robertson_keywords.htm">George G. Robertson </a></li>

   <li class=MsoNormal style='mso-margin-top-alt:auto;mso-margin-bottom-alt:

       auto;mso-list:l7 level3 lfo21;tab-stops:list 1.5in'><a

       href="data/mackinlay_keywords.htm">Jock D. Mackinlay</a></li>

   <li class=MsoNormal style='mso-margin-top-alt:auto;mso-margin-bottom-alt:

       auto;mso-list:l7 level3 lfo21;tab-stops:list 1.5in'><a

       href="data/card_keywords.htm">Stuart K. Card</a></li>

   <li class=MsoNormal style='mso-margin-top-alt:auto;mso-margin-bottom-alt:

       auto;mso-list:l7 level3 lfo21;tab-stops:list 1.5in'><a

       href="data/roth_keywords.htm">Steven F. Roth</a></li>

   <li class=MsoNormal style='mso-margin-top-alt:auto;mso-margin-bottom-alt:

       auto;mso-list:l7 level3 lfo21;tab-stops:list 1.5in'><a

       href="data/stasko_keywords.htm">John T. Stasko</a></li>

   <li class=MsoNormal style='mso-margin-top-alt:auto;mso-margin-bottom-alt:

       auto;mso-list:l7 level3 lfo21;tab-stops:list 1.5in'><a

       href="data/keim_keywords.htm">Daniel A. Keim</a></li>

   <li class=MsoNormal style='mso-margin-top-alt:auto;mso-margin-bottom-alt:

       auto;mso-list:l7 level3 lfo21;tab-stops:list 1.5in'><a

       href="data/chi_keywords.htm">Ed H. Chi </a></li>

   <li class=MsoNormal style='mso-margin-top-alt:auto;mso-margin-bottom-alt:

       auto;mso-list:l7 level3 lfo21;tab-stops:list 1.5in'><a

       href="data/shneiderman_keywords.htm">Ben Shneiderman</a> are provided. </li>
        </ul>
      </li>
    </ul>
  </li>

<li><b>Image 3.1:</b><br>
Not applicable</li><br>

<li><b>Insight 3.1:</b>
  <ul class="middle">
 <li class=MsoNormal style='mso-margin-top-alt:auto;mso-margin-bottom-alt:

      auto;mso-list:l7 level2 lfo21;tab-stops:list 1.0in'>The analysis of the

            keywords in papers authored by George G. Robertson show that his papers

            were primarily focused on <em>user interface </em>and <em>3D graphics</em>.

            The phrase <em>user interface</em> occurred 3 times in keywords

            pertaining to his articles. There are many keywords such as <em>interface

            metaphors</em>, <em>interactive animation</em>, <em>3D user interface</em>,

            etc in his articles. This reflects the research trend during the late

            eighties and early nineties of development of graphical user interface techniques.

            This was before the widespread use of graphical user interface systems.

            Early research in Infovis focused on evolving graphical user interface

            techniques for visualizing information. The keyword analysis of articles

            by Stuart K. Card and Jock D. Mackinlay also shows a similar trend. This

            is not surprising since these authors have collaborated extensively

            amongst themselves. This trio of authors has concentrated on development

            of user interfaces and dealt with the human-computer interaction aspects

      in information visualization.</li>

      <li class=MsoNormal style='mso-margin-top-alt:auto;mso-margin-bottom-alt:

      auto;mso-list:l7 level2 lfo21;tab-stops:list 1.0in'>A keyword analysis of

            articles authored by Steven F. Roth show a high presence of words such as

        <em>graphical user interface, interactive technique, intelligent interface

        </em>and <em>visual query</em>. This shows that Steven F. Roth and his

            collaborators also concentrated on user interface design, albeit with a

            focus on making user interface more interactive and 3D oriented. During

            the early and mid-nineties, they were possibly extending the research

      carried out by the trio of Robertson, Card and Mackinlay. </li>

      <li class=MsoNormal style='mso-margin-top-alt:auto;mso-margin-bottom-alt:

      auto;mso-list:l7 level2 lfo21;tab-stops:list 1.0in'>Research in user

            interface design formed the basis for further research in development of

            specific techniques and visual metaphors for information representation.

            A keyword analysis of articles authored by John T. Stasko shows the occurrence

            of <em>circular/radial display, hierarchical visualization, </em>and <em>algorithm

            animation. </em>This group was possibly focusing on developing specific

            visual metaphors and techniques for information visualization. This

            reflects the shift in research trends from development of basic user

            interface design during the late eighties to more advanced and intuitive

      information visualization during the mid-nineties. </li>

      <li class=MsoNormal style='mso-margin-top-alt:auto;mso-margin-bottom-alt:

      auto;mso-list:l7 level2 lfo21;tab-stops:list 1.0in'>Similarly, the

            explosion of information available via the Internet during the mid-nineties led

            to a focus on data mining as a research area. This is reflected in the

            analysis of keywords of articles by Daniel A. Keim which shows a high

            presence of word such as <em>large data sets, visualizing

            multidimensional data sets, visualizing multivariate data</em> and <em>data

      mining. </em></li>

      <li class=MsoNormal style='mso-margin-top-alt:auto;mso-margin-bottom-alt:

      auto;mso-list:l7 level2 lfo21;tab-stops:list 1.0in'>An analysis of

            keywords in articles by Chi shows the presence of words such as <em>world

            wide web</em>, <em>information ecologies </em>and <em>log file analysis,</em> which

            indicates that Chi and his collaborators primarily focused on web

      applications and network technologies in Infovis. </li>

      <li class=MsoNormal style='mso-margin-top-alt:auto;mso-margin-bottom-alt:

      auto;mso-list:l7 level2 lfo21;tab-stops:list 1.0in'>The keyword analysis

            of words in papers authored by Ben Shneiderman show an interesting trend.

            The phrase <em>dynamic query </em>occurs most often in his papers(8 times),

            apart from <em>tree map, direct manipulation</em>, <em>algorithm</em> and

        <em>user interface </em>. Ben Shneiderman is known to have extensively

            worked in the area of user interface design and developing tree map

            representations of information visualization. This fact is reflected in the

      statistics.</li>

  </ul>
</li>
</ul>

<p><b>Task 3.2: What, if any, are the relationships between two or more or all researchers?</b>
<br>

<ul class="middle">
  <li><b>Process 3.2:</b>
    <ul class="middle">
      <li>Image 3.2 shows the frequency of co-authorship among authors, according to three criteria: all authors in IV core that published no less than 10 papers OR got cited no less than 50 times OR have no less than 20 times of co-authorship with other authors. 17 authors satisfied one or more of the three criteria. All of their co-authors are shown, as well as the resulting 138 author nodes. The node size corresponds to the number of papers published. Node color denotes the total number of received citations. Edge thickness indicates the number of times authors co-authored together.</li>
      <li>Image 3.2 shows the results of a time series analysis of the very same data set. While the node size was not changed, checking off the years leads to a progression of the interconnectivity structure of the co-author network.</li>
    </ul>
  </li>

  <li><b>Image 3.2:</b><br>
  <a href="/docs/data/2004-InfoVis/vs_co_author.gif" target="_blank"><img src="/docs/data/2004-InfoVis/vs_co_author.gif" width="350" style="margin-top:7px;" alt="vs_co_author.gif"></a></li>

  <li>A link to the interactive visualization of the co-author network has been provided in SVG format. Check the boxes showing number of times authors co-authored in order to watch the network grow.</li>
<br>
  <li><b>Insight 3.2:</b>
    <ul class="middle">
      <li>Scholars with more than 10 papers are Ben Shneiderman (23 papers), Stuart K. Card (16), Jock D. Mackinlay (15), Steven F. Roth (12), George Robertson (11), Daniel A. Keim (11) and John T. Stasko (11).</li>
      <li>Authors that received more than 100 citation links are Stuart K. Card (236), Jock D. Mackinlay (212), George G. Robertson (180) and Ben Shneiderman (173).</li>
      <li>The top four authors with the largest number of unique co-authors are Ben Shneiderman (23), Stuart K. Card (17), Jock D. Mackinlay (17) and George G. Robertson (16).</li>
      <li>In IV core, 93.3% of the authors have co-authored.</li>
      <li>The visualization reveals that although Ben Shneiderman authored the most papers, Stuart K.Card received the most citations for his work. One interesting finding is that Ben Shneiderman has a higher number of paper publications and citations to his credit than any of his co-authors. His strongest collaboration has been with Christopher Ahlberg and Catherine Plaisant. It is interesting that Ahlberg (73) is among the list of highly cited authors despite having a relatively smaller number of publications (6) to his credit. He could be among the newer set of scientists whose work in Infovis research has significant impact on the field.</li>
      <li>Nodes representing Ed H. Chi, Daniel Keim and Marc H. Brown are medium-sized and orange in color indicating that they could be cited more in the future.</li>
      <li>Diverse clusters of co-authors can be identified in the visualization. The trio of Stuart K. Card, Jock D. Mackinlay and George G. Robertson has co-authored a number of papers through their years at Xerox. These three authors have been the forerunners of research in Information Visualization. These authors are also the only group of people to have co-authored amongst themselves most often, indicating a very successful research trio. Apart from Stuart K. Card, who seems to have significant collaborations with both Peter Pirolli and Ramana Rao, both Jock D. Mackinlay and George G. Robertson do not seem to have any significant co-authors, despite the latter having the most number of co-authors.</li>
      <li>The visualization also indicates that most authors have not co-authored with the same author very often, except for this trio. This could be because of the evolving nature of the field and increasing number of scientists and researchers joining the field, thus giving rise to newer collaborations. This phenomenon could also explain the presence of most nodes in a light green color and being very small in size. The group consisting of nodes representing Lucy T. Nowell, Edward A. Fox, Dennis J. Brueni, and their co-authors is one such example. They possibly represent authors with fewer publications and fewer citations to their credit, on account of their relatively recent entry into the field.</li>
      <li>Steven F. Roth stands out as an author who has published a relatively large number of papers (12) and has received a sizeable number of citations (50) as well, but who has co-authored with authors with widely varying citation counts to their credit. His strongest collaboration has been with A. J. Kolojechick.</li>
      <li>As per the dataset Steven F. Roth has not co-authored with any author who has published more papers than him; the same is true of Ben Shneiderman.</li>
      <li>Another set of researchers who seem to have co-authored numerous times amongst themselves are John Riedl, Ed H. Chi, Joseph Konstan, Philip Barry and their co-authors.</li>
      <li>The presence of these distinct clusters could also be due to the different research foci and locations of these groups.</li>
      <li>Apart from the presence of few nodes of large size and dark color, representing Stuart K. Card, George G. Robertson, Jock D. Mackinlay, Ben Shneiderman, Steven F. Roth, Peter Pirolli, George W. Furnas, etc, most of the nodes are small and lighter in color. This could indicate that these and other similar nodes represent authors who have been involved in Information Visualization research since its earliest days, and are responsible for the large number of paper publications and citations that can be attributed to them.</li>
      <li>As expected George W. Furnas has very few co-authors in this visualization, probably due to the lesser number of scientists involved in Infovis research in its early days. The color and size of the node representing him shows that he is still widely cited.
      <li>A link to a <a href="http://iv.cns.iu.edu/ref/iv04contest/images/vs_co_author_classes.wmv" target="_blank">video</a> (590 KB) depicting the frequency of collaborations among the authors is also provided.</li>
    </ul>
  </li>

  <li><b>Image 3.3(a):</b><br>
  <a href="/docs/data/2004-InfoVis/vs_co_author_history_new.gif" target="_blank"><img src="/docs/data/2004-InfoVis/vs_co_author_history_new.gif" width="350" style="margin-top:7px;" alt="vs_co_author_history_new.gif"></a></li>
<br>
  <li>A link to the <a href="http://iv.cns.iu.edu/ref/iv04contest/images/vs_co_author_history_new.htm" target="_blank">interactive visualization</a> depicting the history of co-author network has been provided in SVG format. Check years in chronological sequence to watch the growth of the co-author network over time.</li>
<br>
  <li><b>Image 3.3(b):</b><br>
  Time Slices of the Evolving Co-authorship Network<br>
  <a href="/images/teaching/ivmoocbook14/1.7.gif" target="_blank"><img src="/docs/data/2004-InfoVis/evolving_co_author.jpg" width="350" style="margin:7px 7px 0 0;" alt="evolving_co_author.jpg"></a><br>
<em>Click to animate</em>
</li>
<br>
  <li><b>Insight 3.3:</b>
    <ul class="middle">
      <li>Image 3.3(a) shows the results of a time series analysis of the co-authorship network.</li>
      <li>A series of snapshots of the different stages of evolution of the co-authorship network has also been provided in Image 3.3(b)</li>
      <li>The link color indicates the year in which the authors began collaborating. The node color indicates the number of citations that they have received while the node size depicts the number of papers that they have published.</li>
      <li>Alternatively watch the provided <a href="http://iv.cns.iu.edu/ref/iv04contest/images/vs_co_author_history_slices.wmv" target="_blank">video</a> (1.5 MB).</li>
      <li>As the video depicts, Ben Shneiderman was amongst the earliest authors in the field of InfoVis. His earliest collaborations were with J. Callahan, M. Weiser and D. Hopkins, all of whom presumably did not focus on Infovis significantly, as indicated by their node size and color.</li>
      <li>As the network evolves, one can see the presence of Stuart K. Card, George G. Robertson, Steven F. Roth and Jock D. Mackinlay among the earliest collaborators, as expected.</li>
      <li>Subsequently, Daniel Keim, Peter Pirolli, Ramana Rao and Christopher Ahlberg are added.</li>
      <li>The presence of a sudden increase in the number of green colored links indicates that the number of collaborations and authors in Infovis grew significantly in the nineties. Sets of nodes worth noticing in this regard are those representing Lucy Nowell, Guillemo A. Averboch and Scott A. Guyer. The green color of the nodes and links between them could mean that this entire group of researchers began collaborating amongst themselves during the 1990s.</li>
      <li>Similarly Steven F. Roth seems to have begun collaborations with many different authors such as P. Lucas, Mei C. Chuah, Jeffery Senn, and C. C. Gomberg during the early part of the nineties.</li>
      <li>In the early years, one can see distinct clusters of authors, all of which are disconnected from one another. As the years go by, one can see an increasing number of connections among these isolated groups, suggesting greater collaborative work, and overlapping research interests among them.</li>
    </ul>
  </li>
</ul>

<h3 class="data">Comments</h3>


<p>We presented simple statistics, burst analysis results of keywords and

semantic maps of major papers and authors based on the InfoVis Contest 2004

data set. </p>



<p>Given that the data set does not cover papers presented at the annual

InfoVis Conference in <st1:City w:st="on">London</st1:City> or the annual SPIE

Visualization and Data Analysis Conference in <st1:City w:st="on"><st1:place

 w:st="on">San Jose</st1:place></st1:City>, the new <em>Information

Visualization</em> journal, or books, only a partial picture of the domain

could be drawn. </p>



<p>Obviously, it would be very interesting to create a zoomable map of all authors, papers or topics. Ideally, the set of authors, papers or topics that is displayed could be interactively selected via sliders for attributes like number of received citations, number of papers per author etc. A map showing the interconnections among authors, their co-authors and their papers should be of great interest as well [4]. However we were limited in our efforts to display this information on account of the features of visualizing software such as Pajek [1]. </p>
<br>

<h3 class="data">Acknowledgments</h3>

<p>Ketan K. Mane provided support in developing the visualizations for the

citation networks and co-author networks. We appreciate the enormous effort by

Jean-Daniel Fekete, Georges Grinstein and Catherine Plaisant and others in

providing the context data set. This work is supported by a National Science Foundation

CAREER Grant under IIS-0238261 and NSF grant DUE-0333623. </p>
<br>

<h3 class="data">References</h3>

<p><span style='color:black'>1.</span> Batagelj, V. &amp; A. Mrvar <em>Pajek:

Program Package for Large Network Analysis. </em><st1:place w:st="on">

<st1:PlaceType

 w:st="on">University</st1:PlaceType> of <st1:PlaceName w:st="on">Ljubljana</st1:PlaceName></st1:place>.

<st1:country-region w:st="on"><st1:place w:st="on">Slovenia</st1:place></st1:country-region>.

</p>



<p>2. Kleinberg, J.M. (2002).<em> Bursty and hierarchical structure in streams. Proceedings of the 8th ACM SIGKDD Intl. Conf. on Knowledge Discovery and Data

Mining </em>pp 91-101. <st1:State w:st="on"><st1:place w:st="on">New York</st1:place></st1:State>:

ACM Press. . </p>



<p>3. Börner, K., Chen, C., &amp; Boyack, K. (2003). Visualizing knowledge

domains. In Blaise Cronin (Ed.), <em>ARIST 37:Annual Review of Information

Science and Technology</em>, (pp. 179-255), <st1:place w:st="on">

<st1:City

 w:st="on">Medford</st1:City>, <st1:State w:st="on">NJ</st1:State></st1:place>:

Information Today, Inc. </p>



  <p>4. Börner, K., Maru, J. &amp; Goldstone, R. (2004). The simultaneous evolution 

    of author and paper networks. <em>PNAS, 101</em>(Suppl_1):5266-5273. </p>



</div>
</div> 