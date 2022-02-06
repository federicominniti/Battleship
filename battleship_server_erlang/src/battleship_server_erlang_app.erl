%%%-------------------------------------------------------------------
%% @doc battleship_server_erlang public API
%% @end
%%%-------------------------------------------------------------------

-module(battleship_server_erlang_app).

-behaviour(application).

-export([start/2, stop/1]).

start(_StartType, _StartArgs) ->
	Dispatch = cowboy_router:compile([
	        {'_', [{"/", web_socket_handler, {} }]} %% {} initial state is an empty tuple
	]),
	{ok, _} = cowboy:start_clear(http_listener,
		[{port, 8090}],
	    #{env => #{dispatch => Dispatch}}
	)
   	battleship_server_erlang_sup:start_link().

stop(_State) ->
    ok.

%% internal functions
