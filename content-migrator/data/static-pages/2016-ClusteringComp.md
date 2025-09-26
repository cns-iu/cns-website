<style type="text/css">
td.data {
vertical-align:top;
width:407px;
}
tr {
margin: 0 0 20px 0;
display: inline-block;
}
#middle a {
font-weight:400 !important;
}
#middle a:hover {
opacity:.8;
}
</style>

<div id="middle" class="research">

		<h1 style="margin-bottom:20px;">Analysis of Network Clustering Algorithms and Cluster Quality Metrics at Scale</h1>

<div id="container" style="width:865px; margin-bottom:25px;">

		<h3 style="margin-bottom:7px;">Abstract:</h3>
		<p>Notions of community quality underlie the clustering of networks. While studies surrounding network clustering are increasingly common, a precise understanding of the realtionship between different cluster quality metrics is unknown. In this paper, we examine the relationship between stand-alone cluster quality metrics and information recovery metrics through a rigorous analysis of four widely-used network clustering algorithms -- Louvain, Infomap, label propagation, and smart local moving. We consider the stand-alone quality metrics of modularity, conductance, and coverage, and we consider the information recovery metrics of adjusted Rand score, normalized mutual information, and a variant of normalized mutual information used in previous work. Our study includes both synthetic graphs and empirical data sets of sizes varying from 1,000 to 1,000,000 nodes.
		<br><br>

		We find significant differences among the results of the different cluster quality metrics. For example, clustering algorithms can return a value of 0.4 out of 1 on modularity but score 0 out of 1 on information recovery. We find conductance, though imperfect, to be the stand-alone quality metric that best indicates performance on the information recovery metrics. Additionally, our study shows that the variant of normalized mutual information used in previous work cannot be assumed to differ only slightly from traditional normalized mutual information.
		<br><br>

		Smart local moving is the overall best performing algorithm in our study, but discrepancies between cluster evaluation metrics prevent us from declaring it an absolutely superior algorithm. Interestingly, Louvain performed better than Infomap in nearly all the tests in our study, contradicting the results of previous work in which Infomap was superior to Louvain. We find that although label propagation performs poorly when clusters are leusters are less clearly defined, it scales efficiently and accurately to large graphs with well-defined clusters.</p>

		<h3 style="margin-bottom:7px;">Team:</h3>
		<ul class="middle">
		<li><a href="http://scottemmons.com/" target="_blank">Scott Emmons</a></li>
		<li><a href="http://www.cs.arizona.edu/~kobourov/" target="_blank">Stephen Kobourov</a></li>
		<li><a href="https://www.soic.indiana.edu/all-people/profile.html?profile_id=71" target="_blank">Michael Gallant</a></li>
		<li><a href="/current_team/bio/katy_borner.html" target="_blank">Katy Börner</a></li>
		</ul>

		<h3 style="margin-bottom:7px;">Code:</h3>
		<ul class="middle">
		<li><a href="https://github.com/scottemmons/STHClusterAnalysis" target="_blank">Available and documented at GitHub</a></li>
		</ul>

		<h3 style="margin-bottom:7px;">Real-world Datasets:</h3>
		<ul class="middle"> 
		<li><a href="http://snap.stanford.edu/data/web-flickr.html" target="_blank">Flickr related images</a></li>
		<li><a href="http://snap.stanford.edu/data/com-DBLP.html" target="_blank">DBLP co-authorships</a></li>
		</ul>

		<h3 style="margin-bottom:7px;">High-Resolution Figures:</h3>
		<table>
		<tr>
		<td class="data"><a href="/docs/data/2015-ClusteringComp/figure1.pdf" target="_blank"><img src="/docs/data/2015-ClusteringComp/fig1.jpg" style="height: 120px" alt="fig1.jpg"></a><br>
		<p class="caption"><strong>Figure 1:</strong> The experimental procedure of our clustering algorithm comparison.</p></td>
		<td class="data"><a href="/docs/data/2015-ClusteringComp/figure2.pdf" target="_blank"><img src="/docs/data/2015-ClusteringComp/fig2.jpg" style="height: 120px" alt="fig2.jpg"></a><br>
		<p class="caption"><strong>Figure 2:</strong> The impact of μ on cluster detectability, visualized using the spring-embedded "ForceAtlas" algorithm of the software Gephi.</p></td>
		</tr>
		<tr>
		<td class="data"><a href="/docs/data/2015-ClusteringComp/figure3.pdf" target="_blank"><img src="/docs/data/2015-ClusteringComp/fig3.jpg" style="height: 120px" alt="fig3.jpg"></a><br>
		<p class="caption"><strong>Figure 3:</strong> A sample network for which modularity &asymp; 0.34, conductance &asymp; 0.55, and coverage = 0.75. The color of each node defines its cluster.</p></td>
		<td class="data"><a href="/docs/data/2015-ClusteringComp/figure4.pdf" target="_blank"><img src="/docs/data/2015-ClusteringComp/fig4.jpg" style="height: 98px;" alt="fig4.jpg"></a><br>
		<p class="caption"><strong>Figure 4:</strong> A matrix of violin plots illustrating the synthetic graph experiment results at &mu; = 0.40. We drew each "violin" using a Gaussian kernel density estimation. Red lines indicate the minimum, maximum, and mean of the data.</p></td>
		</tr>
		<tr>
		<td class="data"><a href="/docs/data/2015-ClusteringComp/figure5.pdf" target="_blank"><img src="/docs/data/2015-ClusteringComp/fig5.jpg" style="height: 98px;" alt="fig5.jpg"></a><br>
		<p class="caption"><strong>Figure 5:</strong> A matrix of violin plots illustrating the synthetic graph experiment results at &mu; = 0.50. We drew each "violin" using a Gaussian kernel density estimation. Red lines indicate the minimum, maximum, and mean of the data.</p></td>
		<td class="data"><a href="/docs/data/2015-ClusteringComp/figure6.pdf" target="_blank"><img src="/docs/data/2015-ClusteringComp/fig6.jpg" style="height: 98px;" alt="fig6.jpg"></a><br>
		<p class="caption"><strong>Figure 6:</strong> A matrix of violin plots illustrating the synthetic graph experiment results at &mu; = 0.60. We drew each "violin" using a Gaussian kernel density estimation. Red lines indicate the minimum, maximum, and mean of the data. </p></td>
		</tr>
		<tr>
		<td class="data"><a href="/docs/data/2015-ClusteringComp/figure7.pdf" target="_blank"><img src="/docs/data/2015-ClusteringComp/fig7.jpg" style="height: 98px;" alt="fig7.jpg"></a><br>
		<p class="caption"><strong>Figure 7:</strong> (A) A comparison of clustering algorithm performance by modularity on the real-world graphs. (B) A comparison of clustering algorithm performance by conductance on the real-world graphs. (C) A comparison of clustering algorithm performance by coverage on the real-world graphs.</p></td>
		</tr>
		</table>

</div>
</div>