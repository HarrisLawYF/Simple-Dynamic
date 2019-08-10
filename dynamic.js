//Dynamic programmign is all about optimization over plain recursion.
//A problem can be resolved if:
// 1) Overlapping Subproblems
// 2) Optimal Substructure: the probleme can be resolved using the solutions of its subproblems
//The main idea is to store the results of subproblems instead of doing repeated calls on the same input
/*
Eg------------------Traditional Fibonacci---------
function fib(int n){
 if(n <=1){
	return n;
 }
 return fib(n-1) + fib(n-2);
}
--------------------Dynamic Fibonacci-------------
var f = [];
var f[0] = 0;
var f[1] = 1;
for(var i = 2; i<=n;i++){
	f[i] = f[i-1] + f[i-2];
}
return f;
*/

/*
Steps to solve a DP
1) Identify if it is a DP problem
2) Decide a state expression with 
   least parameters Eg. knapsck utilizes [index][weight], shortest path uses [index][distance])
3) Formulate state relationship    
4) Do tabulation (or add memoization)
	- tabulation: bottom up, start from i = 0, till i < n, fills up every array slot
	- memoization: top down, start from i = n, till i <= 0, can also store part of the array slots
*/


//-----------------Find max value path (Simple Dynamic)---------------
//Assume each layer has the same amount of nodes as previous layer
var paths = [
[{src:2, weight:30, dest:[0]},{src:1,weight:40, dest:[0]}],
[{src:4, weight:20, dest:[2]},{src:3, weight:10, dest:[1,2]}],
[{src:6, weight:100, dest:[3,4]},{src:5, weight:50, dest:[3]}]
];

var result = [];

function findMaxPath(paths, n, j){
	//Populate the array with ancestor nodes
	if(n >= paths.length-1){
		result[n] = [
			{sum: paths[n][0].weight,indexes:[paths[n][0].src],next:paths[n][0].dest},
			{sum: paths[n][1].weight,indexes:[paths[n][1].src],next:paths[n][1].dest},
		];
		result[n-1] = [];
		return findMaxPath(paths,n-1,result[n].length-1);
	} else{
		var sum1 = 0;
		var index1 = [];
		var sum2 = 0;
		var index2 = [];
		
		//Since the prerequisite is 1 node will link to at most 2 nodes, we can generate different combination of paths
		if(result[n+1][j].next.includes(paths[n][0].src)){
			sum1 = result[n+1][j].sum + paths[n][0].weight;
			index1 = result[n+1][j].indexes.slice(0);
			index1.push(paths[n][0].src);
		} else{
			// populate virtual path with penalty if two nodes have no link
			sum1 = -99999;
			index1 = result[n+1][j].indexes.slice(0);
			index1.push(paths[n][0].src);
		}
		
		if(result[n+1][j].next.includes(paths[n][1].src)){
			sum2 = result[n+1][j].sum + paths[n][1].weight;
			index2 = result[n+1][j].indexes.slice(0);
			index2.push(paths[n][1].src);
		}else{
			sum2 = -99999;
			index2 = result[n+1][j].indexes.slice(0);
			index2.push(paths[n][1].src);
		}
		
		result[n].push({sum: sum1,indexes:index1, next: paths[n][0].dest});
		result[n].push({sum: sum2,indexes:index2, next: paths[n][1].dest});
		
		// j is the index of combination generates after the population
		if(j>0){
			return findMaxPath(paths,n,j-1);
		} else if(n==0){
			// all paths have been discovered, find the best path now
			for(var count = 0; count < result.length; count++){
				for(var count2 = 0; count2 < result[count].length; count2++)
				{
					console.log(result[count][count2].indexes+", sum: "+result[count][count2].sum);
				}
				console.log("********************");
			}
			result[n].sort((a, b) => (a.sum > b.sum) ? 1 : -1);
			return result[n][result[n].length-1]; // get the last item in this layer since we have sorted it
		} else{
			// get ready to jump into the next layer
			result[n-1] = [];
			return findMaxPath(paths,n-1,result[n].length-1);
		}
	}
}
console.log(findMaxPath(paths,paths.length-1,0));