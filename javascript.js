let { Button, Grid, Row, Col, Collapse, Well, Modal, Popover } = ReactBootstrap;

var recipeArr = [];

var parsedInfo = JSON.parse(localStorage.getItem("_myRecipes"))

if (parsedInfo === null || parsedInfo.length === 0 )
   {
    var recipe1 = new recipeTag("Recipe Name (click me!)","Ingredients go here!","And the method goes here! Bon Appetite!");
     console.log(recipe1);
    recipeArr.push(recipe1);
   } else {

recipeArr = parsedInfo;

   } 
function recipeTag(name, ingredients, method) {
  return (this.name = name), (this.ingredients = ingredients), (this.method = method), (this.recipeId = name);
}

function findReplaceRecipe(recipeId) {
  for (var i = 0; i < recipeArr.length; i++) {
    if (recipeArr[i].recipeId === recipeId) {
      recipeArr[i].name = document.getElementById("nameInput").value;
      recipeArr[i].ingredients = document.getElementById("ingredientsInput").value;
      recipeArr[i].method = document.getElementById("methodInput").value;
    }
  }
}
 
function setLocalStorage() { 
  localStorage.setItem("_myRecipes", JSON.stringify(recipeArr));
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = { recipeArr };  
    this.handler = this.handler.bind(this);
  }
  
  handler(){    
    this.setState({ recipeArr });
    setLocalStorage();
  }

  render() {
    return (
      <div>        
        <h1 className="text-center">Recipe Book</h1>        
        <Popout className="addButton" name="Add Recipe" title="Add a recipe" recipeName="" recipeIngredients="" recipeMethod="" recipeId="" handler={this.handler}/>
        <div>
          <Grid className="grid">
            <RenderRecipes recipes={recipeArr}/>
          </Grid>
        </div>
     </div>
    );
  }
}

class Popout extends React.Component {
  constructor() {
    super();
    this.state = { showModal: false };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  handleClick() {
    if (this.props.name === "Add Recipe") {
      recipeArr.push(new recipeTag(document.getElementById("nameInput").value,document.getElementById("ingredientsInput").value,document.getElementById("methodInput").value ));

      this.setState({ recipeArr });
      this.props.handler();
      
    } else {     
      findReplaceRecipe(this.props.recipeId);
      this.props.handler();
    }
    this.setState({ showModal: false });
  }

  render() {
    return (
      <div>
        <Grid>
          <Button className="addButton" bsStyle="primary" bsSize="large" onClick={this.open}>
            {this.props.name}
          </Button>
          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Grid>
                <Row>
                  <Col md={2}>
                    Recipe Name:
                  </Col>
                  <Col md={10}>
                    <Textform currentValue={this.props.recipeName}areaName="nameInput"/>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md={2}>
                    Ingredients:
                  </Col>
                  <Col md={10}>
                    <Textform currentValue={this.props.recipeIngredients} areaName="ingredientsInput"/>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md={2}>
                    Method:{" "}
                  </Col>
                  <Col md={10}>
                    <Textform currentValue={this.props.recipeMethod} areaName="methodInput"/>
                  </Col>
                </Row>
              </Grid>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleClick}>
                {this.props.name === "Add Recipe" ? "Add" : "Edit"}
              </Button>
              <Button onClick={this.close}>Cancel</Button>
            </Modal.Footer>
          </Modal>
        </Grid>
      </div>
    );
  }
}

class Textform extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.currentValue };
  }

  render() {
    return (
      <div>
        <textarea id={this.props.areaName}>{this.state.value}</textarea>
      </div>
    );
  }
}

class RenderRecipes extends React.Component {
  constructor() {
    super();
    this.state = { recipeArr };
    this.handler = this.handler.bind(this);
  }

  handler() {
    var newRecipeArr = recipeArr;
    setLocalStorage();
    this.setState({ newRecipeArr });
  }

  createRecipes() {
    var recipes = recipeArr;
    var toReturn = [];
    
    for (var i = 0; i < recipes.length; i++) {
      toReturn.push(this.createSingleRecipe(recipes[i]));
    }
    return toReturn;
  }

  createSingleRecipe(recipe) {
    return (
      <div className="grid1">
        <Recipe name={recipe.name} ingredients={recipe.ingredients} method={recipe.method} recipeId={recipe.recipeId} handler={this.handler} edit={this.handler}/>
        <Popout className="buttons" name="Edit Recipe" title="Edit this recipe" recipeName={recipe.name} recipeIngredients={recipe.ingredients} recipeMethod={recipe.method} recipeId={recipe.recipeId} 
          handler={this.handler}/>
      </div>
    );
  }
  
  render() {
    return (
      <div>
        {this.createRecipes()}
      </div>
    );
  }
}

class Recipe extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.delete = this.delete.bind(this);
  }

  delete() {
    for (var i = recipeArr.length; i >= 0; i--) {
      if (recipeArr[i] && recipeArr[i].hasOwnProperty("recipeId") && recipeArr[i]["recipeId"] === this.props.recipeId) 
      {
        recipeArr.splice(i, 1);
        this.setState({ recipeArr });
        this.props.handler();
      }
    }
  }

  render() {
    return (
      <div className="inner-part">
        <Row>
          <Col md={12}>
            <Button className="buttons btn-primary" bsSize="large" block onClick={() => this.setState({ open: !this.state.open })}>
              {this.props.name}
            </Button>
            <Collapse in={this.state.open}>
              <div>
                <Well>
                  <span className="menu">Ingredients:</span><span className="user-info"> {this.props.ingredients}</span>
                  <br />
                  <br />
                  <span className="menu">Method:</span> <span className="user-info">{this.props.method}</span>
                </Well>
              </div>
            </Collapse>
          </Col>
        </Row>
        <Col md={2}>
          <Button className="addButton" bsStyle="danger" bsSize="large"  onClick={this.delete} block>
            Delete
          </Button>
        </Col>
      </div>
    );
  }
}

ReactDOM.render(<Page />, document.getElementsByClassName("container")[0]);