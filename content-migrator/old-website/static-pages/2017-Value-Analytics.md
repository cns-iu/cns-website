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

		<h1 style="margin-bottom:20px;">XDMoD Value Analytics: Visualizing the Impact of Internal IT Investments on External Funding, Publications, and Collaboration Networks</h1>

<div id="container" style="width:865px; margin-bottom:25px;">
		<p>Olga Scrivner, Gagandeep Singh, Sara E Bouchard, Scott Hutcheson, Ben Fulton, Matthew R. Link, and Katy Börner. (In Press). <a href="/docs/data/2017-Value-Analytics/2017-Value-Analytics.pdf" target="_blank">XDMoD Value Analytics: Visualizing the Impact of Internal IT Investments on External Funding, Publications, and Collaboration Networks</a>. Frontiers in Research Metrics and Analytics, Edited by: Kevin Boyack. DOI: 10.3389/frma.2017.00010 </p><br>


		<h3 style="margin-bottom:7px;">Abstract:</h3>
		<p>Many universities invest substantial resources in the design, deployment, and maintenance of campus-based cyberinfrastructure. To justify the expense, it is important that university administrators and others understand and communicate the value of these internal investments in terms of scholarly impact. This paper introduces two visualizations and their usage in the Value Analytics (VA) module for Open XD Metrics on Demand (XDMoD), which enable analysis of external grant funding income, scholarly publications, and collaboration networks. The VA module was developed by Indiana University’s (IU) Research Technologies division, Pervasive Technology Institute, and the <a href="http://cns.iu.edu/" target="_blank">Cyberinfrastructure for Network Science Center (CNS)</a>, in conjunction with the <a href="https://www.buffalo.edu/ccr.html" target="_blank">University at Buffalo’s Center for Computational Research (CCR)</a>. It provides diverse visualizations of measures of information technology (IT) usage, external funding, and publications in support of IT strategic decision making. This paper details the data, analysis workflows, and visual mappings used in two VA visualizations that aim to communicate the value of different IT usage in terms of NSF and NIH funding, resulting publications, and associated research collaborations. To illustrate the feasibility of measuring IT values on research, we measured its financial and academic impact from the period between 2012 and 2017 for IU. The financial return on investment (ROI) is measured in terms of IU funding, totaling $339,013,365 for 885 NIH and NSF projects associated with IT usage, and the academic ROI constitutes 968 publications associated with 83 of these NSF and NIH awards. In addition, the results show that <em>Medical Specialties</em>, <em>Brain Research</em>, and <em>Infectious Diseases</em> are the top three scientific disciplines ranked by the number of publications during the given time period.
</p>

		<br>
		<h3 style="margin-bottom:7px;">Team:</h3>
		<p>Olga Scrivner<sup>1</sup>, Gagandeep Singh<sup>1</sup>, Sara E Bouchard<sup>1</sup>, Scott Hutcheson</a><sup>1</sup>, Ben Fulton<sup>2</sup>, Matthew R. Link<sup>2</sup>, Katy Börner<sup>1</sup></p><br>
		<p><sup>1</sup> Department of Intelligent Systems Engineering, School of Informatics, Computing and Engineering, Indiana University, Bloomington, Indiana, USA</p>
		<p><sup>2</sup> Pervasive Technology Institute, Indiana University, Bloomington, Indiana, USA</p><br>

		<h3 style="margin-bottom:7px;">High-Resolution Figures:</h3>
		<table>

		<tr>
		<td class="data"><a href="/docs/data/2017-Value-Analytics/figure-1.pdf" target="_blank"><img src="/docs/data/2017-Value-Analytics/fig1.jpg" style="height: 175px" alt="fig1.jpg"></a><br>
		<p class="caption"><strong>Figure 1:</strong> Data sources, data linkage, data preparation for XDMoD VA visualizations</p></td>
		<td class="data"><a href="/docs/data/2017-Value-Analytics/figure-2.pdf" target="_blank"><img src="/docs/data/2017-Value-Analytics/fig2.jpg" style="height: 175px" alt="fig2.jpg"></a><br>
		<p class="caption"><strong>Figure 2:</strong>  NIH RePORTER online search query</p></td>
		</tr>

		<tr>
		<td class="data"><a href="/docs/data/2017-Value-Analytics/figure-3.pdf" target="_blank"><img src="/docs/data/2017-Value-Analytics/fig3.jpg" style="height: 175px" alt="fig3.jpg"></a><br>
		<p class="caption"><strong>Figure 3:</strong> JSON data schema for the <em>Funding and Publication Impact</em> visualization plugin</p></td>
		<td class="data"><a href="/docs/data/2017-Value-Analytics/figure-4.pdf" target="_blank"><img src="/docs/data/2017-Value-Analytics/fig4.jpg" style="height: 175px;" alt="fig4.jpg"></a><br>
		<p class="caption"><strong>Figure 4:</strong> JSON data schema for the <em>Co-PI Collaboration Network</em> visualization plugin</p></td>
		</tr>

		<tr>
		<td class="data"><a href="/docs/data/2017-Value-Analytics/figure-5.pdf" target="_blank"><img src="/docs/data/2017-Value-Analytics/fig5.jpg" style="height: 175px;" alt="fig5.jpg"></a><br>
		<p class="caption"><strong>Figure 5:</strong> XDMoD VA Portal, see interactive version at <a href="http://demo.cns.iu.edu/xdmod-p/portal.html" target="_blank">http://demo.cns.iu.edu/xdmod-p/portal.html</a></p></td>
		<td class="data"><a href="/docs/data/2017-Value-Analytics/figure-6.pdf" target="_blank"><img src="/docs/data/2017-Value-Analytics/fig6.jpg" style="height: 175px;" alt="fig6.jpg"></a><br>
		<p class="caption"><strong>Figure 6:</strong> XDMoD VA Funding and Publication Impact Visualization, see interactive version at <a href="http://demo.cns.iu.edu/xdmod-p/impact.html">http://demo.cns.iu.edu/xdmod-p/impact.html</a>.<br><br>

		<b>Replicate Using</b><br>
			Sample Data: <a href="/docs/data/2017-Value-Analytics/XDMoD_VA_Co-PI_Network_Visualization_Code.zip">XDMoD_VA_Co-PI_Network_Visualization_Code.zip</a><br>
			NSF API Retrieval Code: <a href="/docs/data/2017-Value-Analytics/nsfapi.py">nsfapi.py</a><br>
			Visualization Code: <a href="/docs/data/2017-Value-Analytics/XDMoD_VA_Funding_and_Publication_Impact_Visualization_Code.zip">XDMoD_VA_Funding_and_Publication_Impact_Visualization_Code.zip</a><br>
			The UCSD Map of Science <a href="http://cns.iu.edu/2012-UCSDMap.html" target="_blank">http://cns.iu.edu/2012-UCSDMap.html</a><br>
			Visualization: <a href="http://demo.cns.iu.edu/xdmod-p/impact.html">http://demo.cns.iu.edu/xdmod-p/impact.html</a><p>
		</td>
		</tr>

		<tr>
		<td class="data"><a href="/docs/data/2017-Value-Analytics/figure-7.pdf" target="_blank"><img src="/docs/data/2017-Value-Analytics/fig7.jpg" style="height: 175px;" alt="fig7.jpg"></a><br>
		<p class="caption"><strong>Figure 7:</strong> XDMoD VA Co-PI Network Visualization, see interactive version at <a href="http://demo.cns.iu.edu/xdmod-p/co-pi.html" target="_blank">http://demo.cns.iu.edu/xdmod-p/co-pi.html</a>.
		<br><br>
		<b>Replicate Using</b><br>
			Sample Data: <a href="/docs/data/2017-Value-Analytics/XDMoD_VA_Funding_and_Publication_Impact_Data.zip">XDMoD_VA_Funding_and_Publication_Impact_Data.zip</a><br>
			NSF API Retrieval Code: <a href="/docs/data/2017-Value-Analytics/nsfapi.py">nsfapi.py</a><br>
			Visualization Code: <a href="/docs/data/2017-Value-Analytics/XDMoD_VA_Co-PI_Network_Visualization_Code.zip">XDMoD_VA_Co-PI_Network_Visualization_Code.zip</a><br>
			Visualization: <a href="http://demo.cns.iu.edu/xdmod-p/co-pi.html">http://demo.cns.iu.edu/xdmod-p/co-pi.html</a><p>
				
			</p></td>
		</tr>
		</table>

</div>
</div>
