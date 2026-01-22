
class Node {
    constructor(data) {
       this.data = data;
       this.left = null;
       this.right = null;
       this.height = 0;
    }
}

class Tree {
    constructor(array) {
        const sortedArray = [...new Set(array)].sort((a,b) => a - b);
        this.root = this.buildTree(sortedArray);
    }

    buildTree(array) {
        if(array.length === 0) return null;

        const mid = Math.floor(array.length / 2);
        const root = new Node (array[mid])
        root.left = this.buildTree(array.slice(0, mid));
        root.right = this.buildTree(array.slice(mid + 1));

        return root;
    }

    insert(value) {
        this.root = this._insertNode(this.root, value);
    }

    _insertNode(node, value) {
        if(node === null) return new Node(value);

        if(value < node.data) {
            node.left = this._insertNode(node.left, value);
        } else if (value > node.data) {
           node.right = this._insertNode(node.right, value)
        }
        return node;
    }


    delete(value) {
        this.root = this._deleteNode(this.root, value)
    }

    _deleteNode(node, value) {
        if(node === null) return null;

        if(value < node.data){
            node.left = this._deleteNode(node.left, value);
        } else if (value > node.data) {
            node.right = this._deleteNode(node.right, value)
        
        } else {

            if(!node.right && !node.left) return null;
            if(!node.left) return node.right;
            if(!node.right) return node.left;


        let temp = node.right;
        while(temp.left) temp = temp.left;
        node.data = temp.data;
        node.right = this._deleteNode(node.right, temp.data);
        }

         return node;
    }

   

   find(value) {
    let current = this.root;

    while(current !== null) {
        if(value === current.data) {
            return current;
        }

        if( value < current.data)  {
            current = current.left
        } else if (value > current.data) {
            current = current.right
        } 
    }
    return null;
   }


   levelOrderForEach(callback) {  //  node with callback function<---- shift [..queue..] push <--- each node
    if(typeof callback !== "function"){
        throw new Error("callback function is required!")
    }

    if(this.root === null) return;

    const queue = [];   
    queue.push(this.root);

    while(queue.length > 0) {
       const current = queue.shift();

       callback(current);

       if(current.left) queue.push(current.left);
       if(current.right) queue.push(current.right);
       
    }
   }

    
   inOrderForEach(callback) {
    if(typeof callback !== "function"){
        throw new Error("callback function is required!")
    }

    const traverse  =  (node) => {
        if(node === null) return;

        traverse (node.left);
        callback(node);
        traverse (node.right);
    }
        traverse (this.root)

    }


    preOrderForEach(callback) {
     if(typeof callback !== "function"){
        throw new Error("callback function is required!")
    }
    const traverse  = (node) => {
        if(node === null) return;

        callback(node);
        traverse (node.left);
        traverse (node.right);
    }
        traverse (this.root)
    }
    
    postOrderForEach(callback) {
        if(typeof callback !== "function"){
        throw new Error("callback function is required!")
    }

    const traverse = (node) => {
        if(node === null) return;

        traverse(node.left);
        traverse(node.right);
        callback(node)
    }  
        traverse(this.root)
    }



    height(node) {
        if( !node ) return -1;
        node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
        return node.height;
    }

    heightValue(value) {
        const node = this.find(value);
        if(!node) return null;
        return this.height(node);
    }



    depth(value) {
        let current = this.root;
        let depthCount = 0;

        while(current) {
            if(value === current.data) return depthCount;
            current = value < current.data ? current.left : current.right;
            depthCount++;
        }
        return null;
    }



    isBalanced(node = this.root) {
        if(!node) return true;

        const leftHeight = this.height(node.left) ?? -1; //Nullish Coalescing operator - Use right value ONLY if left is null or undefined
        const rightHeight = this.height(node.right) ?? -1;

        const heightDiffer = Math.abs(leftHeight - rightHeight);

        return heightDiffer <= 1 && this.isBalanced(node.left) && this.isBalanced(node.right); //true && true && true ->true(balance);if true && true && false → false(not balance)
 
    }



    rebalance() {
        const values = [];
        this.inOrderForEach(node => values.push(node.data));
        this.root = this.buildTree(values);
    }


}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) return;

  if (node.right !== null) {
    prettyPrint(node.right, prefix + (isLeft ? "│   " : "    "), false);
  }

  console.log(prefix + (isLeft ? "└── " : "┌── ") + node.data);

  if (node.left !== null) {
    prettyPrint(node.left,  prefix + (isLeft ? "    " : "│   "), true );
  }

};


const arr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const myTree = new Tree(arr);
console.log(myTree);
console.log(myTree.root); 
prettyPrint(myTree.root);


myTree.delete(7);  
console.log("\nTree after deleting 7:");
prettyPrint(myTree.root);

myTree.delete(67); 
console.log("\nTree after deleting 67:");
prettyPrint(myTree.root);


const foundNode = myTree.find(23);
console.log("\nTree after finding 23:");
console.log(foundNode); 

myTree.insert(10);
console.log("\nTree after inserting 10:");
prettyPrint(myTree.root);

myTree.insert(0);
console.log("\nTree after inserting 0:");
prettyPrint(myTree.root);

myTree.levelOrderForEach(node => {
    node.data *= 2;
})
prettyPrint(myTree.root);


const inOrderResult = [];
myTree.inOrderForEach(node => {
    inOrderResult.push(node.data);
})
console.log("InOrderForEach: left < node < right   ", inOrderResult.join(" ---> "));


const preOrderResult = [];
myTree.preOrderForEach(node => {
    preOrderResult.push(node.data);
})
console.log("\npreOrderForEach: node < left < right   ", preOrderResult.join(" ---> "));

const postOrderResult = [];
myTree.postOrderForEach(node => {
    postOrderResult.push(node.data);
})
console.log("\npostOrderForEach: left < right < node   ", postOrderResult.join(" ---> "));

console.log("Height of root:", myTree.heightValue(myTree.root.data));
console.log(myTree.heightValue(648));

console.log("Depth of 648:", myTree.depth(648));
console.log("Is balanced?", myTree.isBalanced());

myTree.rebalance();
console.log("Is balanced after rebalance?", myTree.isBalanced());
prettyPrint(myTree.root);

myTree.levelOrderForEach(node => {
    node.data += 2;
})
prettyPrint(myTree.root);

const inOrderResultafterRebalance = [];
myTree.inOrderForEach(node => {
    inOrderResultafterRebalance.push(node.data);
})
console.log("InOrderForEach: left < node < right   ", inOrderResultafterRebalance.join(" ---> "));


const preOrderResultafterRebalance = [];
myTree.preOrderForEach(node => {
    preOrderResultafterRebalance.push(node.data);
})
console.log("\npreOrderForEach: node < left < right   ", preOrderResultafterRebalance.join(" ---> "));

const postOrderResultafterRebalance = [];
myTree.postOrderForEach(node => {
    postOrderResultafterRebalance.push(node.data);
})
console.log("\npostOrderForEach: left < right < node   ", postOrderResultafterRebalance.join(" ---> "));
